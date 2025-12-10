const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define schema
const expressionSchema = new mongoose.Schema({
  expression: String,
  timestamp: { type: Date, default: Date.now }
});

// Create model
const Expression = mongoose.model('Expression', expressionSchema);

// POST /api/expression
router.post('/', async (req, res) => {
  try {
    const { expression } = req.body;
    const entry = new Expression({ expression });
    await entry.save();
    res.status(201).json({ message: 'Expression saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save expression' });
  }
});

module.exports = router;
