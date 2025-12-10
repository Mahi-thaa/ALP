const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const QuestionLog = require("../models/QuestionLog");
const User = require("../models/User");

// Adaptive logic: emotion → new difficulty
const adaptLevel = (emotion, currentLevel) => {
    const levels = ["easy", "medium", "hard"];
    let index = levels.indexOf(currentLevel);

    if (emotion === "happy" || emotion === "neutral") index++;
    else if (emotion === "confused" || emotion === "sad") index--;
    else if (emotion === "angry") return "easy";

    return levels[Math.max(0, Math.min(index, 2))];
};

router.post("/", async (req, res) => {
    try {
        const { userId, questionId, selectedAnswer, emotionDetected } = req.body;

        const question = await Question.findById(questionId);
        const user = await User.findById(userId);
        if (!question || !user) return res.status(404).json({ message: "Invalid question or user" });

        const isCorrect = selectedAnswer === question.correctAnswer;

        // Save question attempt
        await QuestionLog.create({
            userId,
            questionId,
            selectedAnswer,
            isCorrect,
            emotionDetected
        });

        // Update user progress
        user.currentLevel = adaptLevel(emotionDetected, user.currentLevel);
        await user.save();

        // Serve new adaptive question
        const nextQuestion = await Question.findOne({
            topic: user.currentTopic,
            difficulty: user.currentLevel
        });

        res.json({
            message: "Log saved",
            isCorrect,
            emotionDetected,
            nextQuestion
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    // Handle unmatched routes at the end
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

});

module.exports = router;
