const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        default: "user"
    },
    currentLevel: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "easy"
    },
    currentTopic: {
        type: String,
        default: "math" // or science, english, etc.
    },
    studentEmail: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);
