const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');

// POST /api/suggestions — Save a suggestion
router.post('/', async (req, res) => {
  try {
    const { from, to, message, role } = req.body;
    const suggestion = await Suggestion.create({ from, to, message, role });
    res.status(201).json(suggestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/suggestions?to=studentEmail&role=parent — Fetch suggestions
router.get('/', async (req, res) => {
  try {
    const { to, role } = req.query;
    const suggestions = await Suggestion.find({ to, role }).sort({ timestamp: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 