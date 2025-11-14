const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Ask AI about museum
router.post('/ask', async (req, res) => {
    try {
        const { museumName, museumDescription, question, conversationHistory } = req.body;

        if (!question || !museumName) {
            return res.status(400).json({ error: 'Question and museum name required' });
        }

        // Build context-aware prompt
        let prompt = `You are an enthusiastic museum tour guide for ${museumName}.

Museum Information:
${museumDescription}

`;

        // Add conversation history for context
        if (conversationHistory && conversationHistory.length > 0) {
            prompt += `Previous conversation:\n`;
            conversationHistory.forEach(msg => {
                prompt += `${msg.role === 'user' ? 'Visitor' : 'Guide'}: ${msg.content}\n`;
            });
            prompt += `\n`;
        }

        prompt += `Current visitor question: ${question}

Provide a helpful, engaging answer in 2-3 sentences. Be conversational and educational. If the question isn't directly related to this museum, gently guide them back to relevant information about ${museumName}.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();

        res.json({
            answer: answer,
            museum: museumName,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Gemini API error:', error.message);

        // Fallback response
        res.json({
            answer: "I'm having trouble connecting right now, but I'd love to help! This museum has fascinating exhibits and rich history. Try asking me another question!",
            museum: req.body.museumName,
            error: true
        });
    }
});

module.exports = router;