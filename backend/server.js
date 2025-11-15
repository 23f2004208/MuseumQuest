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
        const { museumName, museumDescription, question } = req.body;
        console.log('🤖 AI Question:', question);

        if (!question) return res.status(400).json({ error: 'Question required' });

        const prompt = `You are a museum tour guide for ${museumName}. ${museumDescription}\n\nQuestion: ${question}\n\nAnswer in 2-3 sentences:`;

        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        console.log('✅ AI answered');
        res.json({ answer, museum: museumName });

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
    res.json({ message: 'API Working', endpoints: ['/api/museums', '/api/ai/ask', '/api/wolfram/context/:year'] });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));