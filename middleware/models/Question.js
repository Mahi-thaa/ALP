// models/Question.js
/*const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionText: String,
    options: [String],
    correctAnswer: String,
    topic: String, // e.g., "math", "science"
    difficulty: { type: String, enum: ["easy", "medium", "hard"] }
});

module.exports = mongoose.model("Question", questionSchema);*/
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
  emotionLevel: String,
  subject: String,   // e.g., "Math", "English", "Logical Reasoning"
  activity: String,  // e.g., "MCQ", "Story Builder", "Word Match"
  difficulty: String // e.g., "easy", "medium", "hard"
});

module.exports = mongoose.model('Question', QuestionSchema);

