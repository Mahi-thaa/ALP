const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const User = require('../models/User');

// Adaptive logic: emotion → new difficulty
const adaptLevel = (emotion, currentLevel) => {
    const levels = ["easy", "medium", "hard"];
    let index = levels.indexOf(currentLevel);

    if (emotion === "happy" || emotion === "neutral") index++;
    else if (emotion === "confused" || emotion === "sad") index--;
    else if (emotion === "angry") return "easy";

    return levels[Math.max(0, Math.min(index, 2))];
};

// POST /api/next-question
// Expects: { userId, emotion, topic }
router.post('/', async (req, res) => {
    try {
        const { userId, emotion, topic } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Adapt level based on emotion
        const newLevel = adaptLevel(emotion, user.currentLevel);
        user.currentLevel = newLevel;
        await user.save();

        // Find a question matching the new difficulty and topic
        const question = await Question.findOne({ difficulty: newLevel, topic });
        if (!question) return res.status(404).json({ error: 'No question found for this difficulty/topic' });

        res.json({
            question: {
                id: question._id,
                questionText: question.questionText,
                options: question.options,
                difficulty: question.difficulty,
                topic: question.topic
            },
            userLevel: newLevel
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get next question', details: err.message });
    }
});

module.exports = router; 