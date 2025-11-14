const express = require('express');
const router = express.Router();
const axios = require('axios');

const WOLFRAM_APP_ID = process.env.WOLFRAM_APP_ID;

// Get historical context for museum
router.get('/context/:year', async (req, res) => {
    try {
        const year = parseInt(req.params.year);

        if (!year || year < 1000 || year > 2025) {
            return res.status(400).json({ error: 'Invalid year' });
        }

        const results = {
            year: year,
            age: null,
            ageYears: null,
            historicalEvents: null
        };

        // Calculate museum age in days
        try {
            const ageQuery = `days between ${year} and today`;
            const ageUrl = `http://api.wolframalpha.com/v1/result?appid=${WOLFRAM_APP_ID}&i=${encodeURIComponent(ageQuery)}`;
            const ageResponse = await axios.get(ageUrl, { timeout: 5000 });
            results.age = ageResponse.data;

            // Also calculate years
            const currentYear = new Date().getFullYear();
            results.ageYears = currentYear - year;
        } catch (err) {
            console.log('Age calculation failed, using fallback');
            const currentYear = new Date().getFullYear();
            results.ageYears = currentYear - year;
            results.age = `Approximately ${results.ageYears} years old`;
        }

        // Get historical context
        try {
            const eventsQuery = `what happened in ${year}`;
            const eventsUrl = `http://api.wolframalpha.com/v1/result?appid=${WOLFRAM_APP_ID}&i=${encodeURIComponent(eventsQuery)}`;
            const eventsResponse = await axios.get(eventsUrl, { timeout: 5000 });
            results.historicalEvents = eventsResponse.data;
        } catch (err) {
            console.log('Events query failed, using fallback');

            // Fallback historical facts
            const historicalFacts = {
                1506: 'Construction of St. Peter\'s Basilica began, Mona Lisa completed',
                1753: 'British Museum founded, Benjamin Franklin\'s kite experiment',
                1764: 'Mozart composed first symphony at age 8',
                1793: 'Louis XVI executed, Louvre opened as public museum',
                1800: 'Alessandro Volta invented the battery',
                1819: 'Simón Bolívar liberated Colombia, first steamship crossed Atlantic',
                1870: 'Franco-Prussian War, Standard Oil founded',
                1902: 'First Rose Bowl game, Theodore Roosevelt became president',
                1910: 'Mexican Revolution began, Boy Scouts founded',
                2003: 'Human Genome Project completed, Mars Exploration Rover launched'
            };

            results.historicalEvents = historicalFacts[year] || `Major historical events occurred in ${year}`;
        }

        res.json(results);

    } catch (error) {
        console.error('Wolfram API error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch historical context',
            year: req.params.year
        });
    }
});

module.exports = router;