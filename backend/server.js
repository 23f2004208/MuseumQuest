const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

// Museums data - ALL 10 MUSEUMS
const museums = [
    { id: 1, name: "The Louvre", lat: 48.8606, lng: 2.3376, country: "France", yearFounded: 1793, description: "The world's largest art museum in Paris." },
    { id: 2, name: "British Museum", lat: 51.5194, lng: -0.1270, country: "United Kingdom", yearFounded: 1753, description: "Museum of human history in London." },
    { id: 3, name: "Metropolitan Museum of Art", lat: 40.7794, lng: -73.9632, country: "United States", yearFounded: 1870, description: "Largest art museum in the United States." },
    { id: 4, name: "Vatican Museums", lat: 41.9065, lng: 12.4536, country: "Vatican City", yearFounded: 1506, description: "Art and Christian museums in Vatican City." },
    { id: 5, name: "Rijksmuseum", lat: 52.3600, lng: 4.8852, country: "Netherlands", yearFounded: 1800, description: "Dutch national museum in Amsterdam." },
    { id: 6, name: "National Museum of China", lat: 39.9042, lng: 116.3974, country: "China", yearFounded: 2003, description: "Museum of Chinese art in Beijing." },
    { id: 7, name: "State Hermitage Museum", lat: 59.9398, lng: 30.3146, country: "Russia", yearFounded: 1764, description: "Art museum in Saint Petersburg." },
    { id: 8, name: "Museo Nacional del Prado", lat: 40.4138, lng: -3.6921, country: "Spain", yearFounded: 1819, description: "Spain's main art museum in Madrid." },
    { id: 9, name: "Egyptian Museum", lat: 30.0478, lng: 31.2336, country: "Egypt", yearFounded: 1902, description: "Ancient Egyptian antiquities in Cairo." },
    { id: 10, name: "Smithsonian Natural History", lat: 38.8913, lng: -77.0261, country: "United States", yearFounded: 1910, description: "Natural history museum in D.C." }
];

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