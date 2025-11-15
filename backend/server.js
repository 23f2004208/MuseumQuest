import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { museums } from '../frontend/src/data/museums.js';

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

// AI CHATBOT ENDPOINT
app.post('/api/ai/ask', async (req, res) => {
    try {
        const { museumName, museumDescription, question, userId, museumId } = req.body;
        console.log('🤖 AI Question:', question);

        if (!question) return res.status(400).json({ error: 'Question required' });

        const prompt = `You are a museum tour guide for ${museumName}. ${museumDescription}\n\nQuestion: ${question}\n\nAnswer in 2-3 sentences:`;

        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        // Track question count and award stamp after 3 questions
        let questionCount = 0;
        let stampAwarded = false;

        if (userId) {
            // Initialize user if doesn't exist
            if (!userProgress[userId]) {
                userProgress[userId] = {
                    stamps: [],
                    xp: 0,
                    level: "Tourist",
                    visitedMuseums: new Set(),
                    aiQuestionCount: 0
                };
            }

            // Increment question count
            userProgress[userId].aiQuestionCount = (userProgress[userId].aiQuestionCount || 0) + 1;
            questionCount = userProgress[userId].aiQuestionCount;

            // Check if AI_QUESTIONS stamp already exists
            const alreadyHasStamp = userProgress[userId].stamps.some(
                s => s.type === "AI_QUESTIONS"
            );

            // Award stamp only after 3 questions and if not already awarded
            if (questionCount === 3 && !alreadyHasStamp) {
                const xpGained = 20;
                userProgress[userId].xp += xpGained;
                userProgress[userId].stamps.push({
                    type: "AI_QUESTIONS",
                    museumId: museumId || null,
                    timestamp: new Date().toISOString()
                });

                // Recalculate level
                const xp = userProgress[userId].xp;
                if (xp >= 200) userProgress[userId].level = "Museum Legend";
                else if (xp >= 100) userProgress[userId].level = "Curator";
                else if (xp >= 50) userProgress[userId].level = "Explorer";

                console.log(`🎉 AI Questions stamp awarded! (+${xpGained} XP) to ${userId} after ${questionCount} questions`);
                stampAwarded = true;
            } else if (questionCount < 3) {
                console.log(`💬 AI question ${questionCount}/3 for ${userId}`);
            }
        }

        console.log('✅ AI answered');
        res.json({
            answer,
            museum: museumName,
            questionCount: questionCount,
            stampAwarded: stampAwarded
        });

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

// PASSPORT 
// Add after your existing endpoints in backend/server.js

// In-memory storage for demo
const userProgress = {};

// Award stamp endpoint
app.post('/api/passport/stamp', (req, res) => {
    const { userId, stampType, museumId } = req.body;

    // Initialize user if doesn't exist
    if (!userProgress[userId]) {
        userProgress[userId] = {
            stamps: [],
            xp: 0,
            level: 'Tourist',
            visitedMuseums: new Set(),
            aiQuestionCount: 0
        };
    }

    const user = userProgress[userId];

    // XP values for each stamp type
    const stampXP = {
        VISITED: 10,
        QUIZ_PASSED: 25,
        AI_QUESTIONS: 20,
        ALL_IMAGES_VIEWED: 15
    };

    // Check if stamp already exists for this museum
    const alreadyHasStamp = user.stamps.some(
        s => s.type === stampType && s.museumId === museumId
    );

    if (alreadyHasStamp) {
        return res.json({
            success: false,
            message: 'Stamp already earned',
            passport: user
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
    user.visitedMuseums.add(museumId);

    // Calculate level
    if (user.xp >= 200) user.level = 'Museum Legend';
    else if (user.xp >= 100) user.level = 'Curator';
    else if (user.xp >= 50) user.level = 'Explorer';
    else user.level = 'Tourist';

    console.log(`✅ Stamp awarded: ${stampType} (+${xpGained} XP) to ${userId}`);

    res.json({
        success: true,
        xpGained,
        newXP: user.xp,
        level: user.level,
        passport: {
            ...user,
            visitedMuseums: Array.from(user.visitedMuseums)
        }
    });
});

// QUIZ COMPLETION ENDPOINT
app.post('/api/passport/quiz', (req, res) => {
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

    const alreadyHasQuiz = userProgress[userId]?.stamps?.some(
        s => s.type === "QUIZ_PASSED" && s.museumId === museumId
    );

    if (alreadyHasQuiz) {
        return res.json({
            success: false,
            message: "Quiz stamp already earned",
            passport: userProgress[userId]
        });
    }

    if (!userProgress[userId]) {
        userProgress[userId] = {
            stamps: [],
            xp: 0,
            level: "Tourist",
            visitedMuseums: new Set(),
            aiQuestionCount: 0
        };
    }

    userProgress[userId].xp += 25;
    userProgress[userId].stamps.push({
        type: "QUIZ_PASSED",
        museumId,
        timestamp: new Date().toISOString()
    });

    // Recalculate level
    const xp = userProgress[userId].xp;
    if (xp >= 200) userProgress[userId].level = "Museum Legend";
    else if (xp >= 100) userProgress[userId].level = "Curator";
    else if (xp >= 50) userProgress[userId].level = "Explorer";

    console.log(`✅ Quiz passed! Stamp awarded: QUIZ_PASSED (+25 XP) to ${userId} for museum ${museumId}`);

    res.json({
        success: true,
        xpGained: 25,
        newXP: userProgress[userId].xp,
        level: userProgress[userId].level,
        passport: {
            ...userProgress[userId],
            visitedMuseums: Array.from(userProgress[userId].visitedMuseums)
        }
    });
});


// Get user's passport
app.get('/api/passport/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = userProgress[userId] || {
        stamps: [],
        xp: 0,
        level: 'Tourist',
        visitedMuseums: []
    };

    res.json({
        ...user,
        visitedMuseums: Array.from(user.visitedMuseums || [])
    });
});

// Get leaderboard (bonus!)
app.get('/api/leaderboard', (req, res) => {
    const leaderboard = Object.entries(userProgress)
        .map(([userId, data]) => ({
            userId,
            xp: data.xp,
            level: data.level,
            museumsVisited: data.visitedMuseums.size
        }))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 10);

    res.json(leaderboard);
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
    res.json({ status: '✅ Running!' });
});

app.get('/', (req, res) => {
    res.json({ message: 'API Working', endpoints: ['/api/museums', '/api/ai/ask', '/api/wolfram/context/:year'] });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));