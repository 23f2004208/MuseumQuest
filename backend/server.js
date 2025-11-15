import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { museums } from '../frontend/src/data/museums.js';
import { quizzes } from '../frontend/src/data/quizzes.js';
import { db } from './firebase-admin.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

// MUSEUMS ENDPOINTS
app.get('/api/museums', (req, res) => {
    console.log('✅ Returning', museums.length, 'museums');
    res.json(museums);
});

app.get('/api/museums/:id', (req, res) => {
    const museum = museums.find(m => m.id === parseInt(req.params.id));
    if (!museum) return res.status(404).json({ error: 'Not found' });
    res.json(museum);
});

// QUIZ ENDPOINTS
// GET quiz for a specific museum
app.get('/api/quiz/:museumId', (req, res) => {
    const museumId = parseInt(req.params.museumId);
    const quiz = quizzes.find(q => q.museumId === museumId);

    if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
    }

    // Return questions WITHOUT correct answers (security!)
    const safeQuestions = quiz.questions.map(q => ({
        question: q.question,
        options: q.options
    }));

    res.json({ museumId, questions: safeQuestions });
});

// POST to check quiz answers
app.post('/api/quiz/check', (req, res) => {
    const { museumId, answers } = req.body; // answers = [1, 2, 0, 3, 1]

    const quiz = quizzes.find(q => q.museumId === museumId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    let correct = 0;
    quiz.questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) correct++;
    });

    const score = correct / quiz.questions.length;

    res.json({
        correct,
        total: quiz.questions.length,
        score,
        passed: score >= 0.8
    });
});

// PASSPORT 
// Firestore helper functions

/**
 * Get user progress from Firestore
 * Returns data in the format expected by the API (xp, level, stamps, visitedMuseums as array)
 */
async function getUserProgress(userId) {
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            const data = userDoc.data();
            // Convert Firestore data to API format
            // Handle both old format (totalXP, currentLevel) and new format (xp, level)
            return {
                stamps: data.stamps || [],
                xp: data.xp || data.totalXP || 0,
                level: data.level || data.currentLevel || 'Tourist',
                visitedMuseums: data.visitedMuseums ? (Array.isArray(data.visitedMuseums) ? data.visitedMuseums : []) : [],
                username: data.username || userId
            };
        }

        // Return default structure if user doesn't exist
        return {
            stamps: [],
            xp: 0,
            level: 'Tourist',
            visitedMuseums: [],
            username: userId
        };
    } catch (error) {
        console.error('Error getting user progress:', error);
        throw error;
    }
}

/**
 * Update user progress in Firestore
 */
async function updateUserProgress(userId, userData) {
    try {
        const userRef = db.collection('users').doc(userId);

        // Convert visitedMuseums Set to array if needed
        const visitedMuseumsArray = Array.isArray(userData.visitedMuseums)
            ? userData.visitedMuseums
            : (userData.visitedMuseums instanceof Set
                ? Array.from(userData.visitedMuseums)
                : []);

        // Prepare data for Firestore (remove Set, ensure arrays)
        const firestoreData = {
            stamps: userData.stamps || [],
            xp: userData.xp || 0,
            level: userData.level || 'Tourist',
            visitedMuseums: visitedMuseumsArray,
            username: userData.username || userId,
            lastUpdated: new Date()
        };

        await userRef.set(firestoreData, { merge: true });
        return firestoreData;
    } catch (error) {
        console.error('Error updating user progress:', error);
        throw error;
    }
}

/**
 * Calculate level based on XP
 */
function calculateLevel(xp) {
    if (xp >= 200) return 'Museum Legend';
    if (xp >= 100) return 'Curator';
    if (xp >= 50) return 'Explorer';
    return 'Tourist';
}

// Award stamp endpoint
app.post('/api/passport/stamp', async (req, res) => {
    try {
        const { userId, stampType, museumId, username } = req.body;

        // Get user progress from Firestore
        let user = await getUserProgress(userId);

        // Update username if provided
        if (username) {
            user.username = username;
        }

        // XP values for each stamp type
        const stampXP = {
            VISITED: 10,
            QUIZ_PASSED: 25
        };

        // Check if stamp already exists for this museum
        const alreadyHasStamp = user.stamps.some(
            s => s.type === stampType && s.museumId === museumId
        );

        if (alreadyHasStamp) {
            return res.json({
                success: false,
                message: 'Stamp already earned',
                passport: {
                    ...user,
                    visitedMuseums: Array.isArray(user.visitedMuseums) ? user.visitedMuseums : []
                }
            });
        }

        // Award stamp
        const xpGained = stampXP[stampType] || 0;
        user.xp += xpGained;
        user.stamps.push({
            type: stampType,
            museumId,
            timestamp: new Date().toISOString()
        });

        // Add museum to visitedMuseums if not already there
        if (!user.visitedMuseums.includes(museumId)) {
            user.visitedMuseums.push(museumId);
        }

        // Calculate level
        user.level = calculateLevel(user.xp);

        // Update in Firestore
        await updateUserProgress(userId, user);

        console.log(`✅ Stamp awarded: ${stampType} (+${xpGained} XP) to ${userId}`);

        res.json({
            success: true,
            xpGained,
            newXP: user.xp,
            level: user.level,
            passport: {
                ...user,
                visitedMuseums: Array.isArray(user.visitedMuseums) ? user.visitedMuseums : []
            }
        });
    } catch (error) {
        console.error('Error awarding stamp:', error);
        res.status(500).json({ error: 'Failed to award stamp' });
    }
});

// QUIZ COMPLETION ENDPOINT
app.post('/api/passport/quiz', async (req, res) => {
    try {
        const { userId, museumId, score } = req.body;

        if (!userId || !museumId) {
            return res.status(400).json({ error: "userId and museumId required" });
        }

        // Check if score is provided and is 80% or higher
        if (score === undefined || score === null) {
            return res.status(400).json({ error: "score is required" });
        }

        if (score < 0.8) {
            return res.json({
                success: false,
                message: "Quiz not passed. Need 80% or higher to earn stamp.",
                score: score,
                requiredScore: 0.8
            });
        }

        // Get user progress from Firestore
        let user = await getUserProgress(userId);

        const alreadyHasQuiz = user.stamps.some(
            s => s.type === "QUIZ_PASSED" && s.museumId === museumId
        );

        if (alreadyHasQuiz) {
            return res.json({
                success: false,
                message: "Quiz stamp already earned",
                passport: {
                    ...user,
                    visitedMuseums: Array.isArray(user.visitedMuseums) ? user.visitedMuseums : []
                }
            });
        }

        user.xp += 25;
        user.stamps.push({
            type: "QUIZ_PASSED",
            museumId,
            timestamp: new Date().toISOString()
        });

        // Add museum to visitedMuseums if not already there
        if (!user.visitedMuseums.includes(museumId)) {
            user.visitedMuseums.push(museumId);
        }

        // Recalculate level
        user.level = calculateLevel(user.xp);

        // Update in Firestore
        await updateUserProgress(userId, user);

        console.log(`✅ Quiz passed! Stamp awarded: QUIZ_PASSED (+25 XP) to ${userId} for museum ${museumId}`);

        res.json({
            success: true,
            xpGained: 25,
            newXP: user.xp,
            level: user.level,
            passport: {
                ...user,
                visitedMuseums: Array.isArray(user.visitedMuseums) ? user.visitedMuseums : []
            }
        });
    } catch (error) {
        console.error('Error processing quiz:', error);
        res.status(500).json({ error: 'Failed to process quiz' });
    }
});

// Get user's passport
app.get('/api/passport/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await getUserProgress(userId);

        res.json({
            ...user,
            visitedMuseums: Array.isArray(user.visitedMuseums) ? user.visitedMuseums : []
        });
    } catch (error) {
        console.error('Error getting passport:', error);
        res.status(500).json({ error: 'Failed to get passport' });
    }
});

// Get leaderboard - Top 10 users by XP with rank, username, XP, and museums visited
app.get('/api/leaderboard', async (req, res) => {
    try {
        console.log('📊 Fetching leaderboard from Firestore...');

        // Get all users from Firestore
        const usersSnapshot = await db.collection('users').get();

        console.log(`Found ${usersSnapshot.size} users in Firestore`);

        const leaderboard = [];

        usersSnapshot.forEach((doc) => {
            const userId = doc.id;
            const data = doc.data();

            console.log(`Processing user ${userId}:`, {
                totalXP: data.totalXP,
                xp: data.xp,
                currentLevel: data.currentLevel,
                level: data.level
            });

            // Handle both old and new data formats - prioritize totalXP/currentLevel
            const xp = data.totalXP || data.xp || 0;
            const level = data.currentLevel || data.level || 'Tourist';
            const visitedMuseums = data.visitedMuseums || [];
            const museumsVisited = Array.isArray(visitedMuseums) ? visitedMuseums.length : 0;

            leaderboard.push({
                userId,
                username: data.username || userId,
                xp: xp,
                level: level,
                museumsVisited: museumsVisited,
                stampsEarned: (data.stamps || []).length
            });
        });

        // Sort by XP descending and get top 10
        const topUsers = leaderboard
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 10)
            .map((user, index) => ({
                rank: index + 1,
                ...user
            }));

        console.log(`📊 Leaderboard result - ${topUsers.length} users, total: ${leaderboard.length}`);

        res.json({
            success: true,
            leaderboard: topUsers,
            totalUsers: leaderboard.length
        });
    } catch (error) {
        console.error('❌ Error getting leaderboard:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get leaderboard',
            message: error.message
        });
    }
});

// AI ENDPOINTS
// AI CHATBOT ENDPOINT
app.post('/api/ai/ask', async (req, res) => {
    try {
        const { museumName, museumDescription, question } = req.body;  // Remove userId, museumId
        console.log('🤖 AI Question:', question);

        if (!question) return res.status(400).json({ error: 'Question required' });

        const prompt = `You are a museum tour guide for ${museumName}. ${museumDescription}\n\nQuestion: ${question}\n\nAnswer in 2-3 sentences:`;

        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        console.log('✅ AI answered');
        res.json({ answer, museum: museumName });  // Remove questionCount, stampAwarded

    } catch (error) {
        console.error('❌ AI Error:', error.message);
        res.json({ answer: "Sorry, having trouble right now!", error: true });
    }
});

app.get('/api/models/list', async (req, res) => {
    try {
        const client = genAI;
        // Note: The SDK might not have a direct listModels method
        // But you can try making a direct API call
        const response = await axios.get(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('❌ Error listing models:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// WOLFRAM ENDPOINT
app.get('/api/wolfram/context/:year', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        console.log('🔬 Wolfram for year:', year);

        const currentYear = new Date().getFullYear();
        const ageYears = currentYear - year;

        const facts = {
            1506: 'St. Peter\'s Basilica construction began',
            1753: 'British Museum founded',
            1764: 'Hermitage Museum founded',
            1793: 'Louvre opened, French Revolution',
            1800: 'Volta invented battery',
            1819: 'Prado Museum opened',
            1870: 'Met Museum founded',
            1902: 'Egyptian Museum opened',
            1910: 'Natural History expansion',
            2003: 'National Museum of China established'
        };

        res.json({
            year,
            ageYears,
            age: `${ageYears} years old`,
            historicalEvents: facts[year] || `Events from ${year}`
        });

    } catch (error) {
        console.error('❌ Wolfram error:', error.message);
        res.status(500).json({ error: 'Failed' });
    }
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
    res.json({ status: '✅ Running!' });
});

app.get('/', (req, res) => {
    res.json({ message: 'API Working', endpoints: [
        '/api/museums',
        '/api/quiz/:museumId',
        '/api/quiz/check',
        '/api/passport/:userId',
        '/api/leaderboard',
        '/api/ai/ask',
        '/api/models/list',
        '/api/wolfram/context/:year',
        '/api/health'
    ].join('\n') });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
