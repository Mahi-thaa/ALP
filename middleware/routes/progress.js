const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Get progress for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progress.findOne({ userId });
    res.json(progress ? progress.data : {});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update progress for a user
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data } = req.body;
    let progress = await Progress.findOne({ userId });
    if (progress) {
      progress.data = data;
      await progress.save();
    } else {
      progress = new Progress({ userId, data });
      await progress.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
