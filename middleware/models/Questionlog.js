// models/QuestionLog.js
const mongoose = require("mongoose");

const questionLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },

    selectedAnswer: String,
    isCorrect: Boolean,
    emotionDetected: {
        type: String, // e.g., "happy", "confused", "sad"
        enum: ["happy", "sad", "confused", "neutral", "angry"]
    },

    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("QuestionLog", questionLogSchema);
