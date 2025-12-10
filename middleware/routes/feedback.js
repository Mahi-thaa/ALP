const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const User = require('../models/User');

// POST /api/feedback — Therapist posts feedback for a student
router.post('/', async (req, res) => {
  try {
    const { therapistId, studentId, message } = req.body;
    // Check therapist role
    const therapist = await User.findById(therapistId);
    if (!therapist || therapist.role !== 'therapist') {
      return res.status(403).json({ error: 'Only therapists can send feedback.' });
    }
    const feedback = await Feedback.create({ therapistId, studentId, message });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feedback/:studentId — Get all feedback for a student
router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const feedbacks = await Feedback.find({ studentId }).sort({ timestamp: -1 });
    // Optionally populate therapist name
    const populated = await Promise.all(feedbacks.map(async fb => {
      const therapist = await User.findById(fb.therapistId);
      return {
        message: fb.message,
        timestamp: fb.timestamp,
        therapistName: therapist ? therapist.name : 'Unknown',
      };
    }));
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 