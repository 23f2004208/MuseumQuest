const express = require('express');
const router = express.Router();
const museums = require('../data/museums');

// GET all museums
router.get('/', (req, res) => {
    res.json(museums);
});

// GET single museum
router.get('/:id', (req, res) => {
    const museum = museums.find(m => m.id === parseInt(req.params.id));
    if (!museum) {
        return res.status(404).json({ error: 'Museum not found' });
    }
    res.json(museum);
});

module.exports = router;