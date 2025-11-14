const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const museumsRouter = require('./routes/museums');
const aiRouter = require('./routes/ai');
const wolframRouter = require('./routes/wolfram');

app.use('/api/museums', museumsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/wolfram', wolframRouter);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API',
        endpoints: {
            health: '/api/health',
            museums: '/api/museums',
            ai: '/api/ai',
            wolfram: '/api/wolfram'
        }
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: '✅ Backend running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});