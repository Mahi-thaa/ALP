const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error: ", err));

// ✅ ROUTES

// ➤ Question Routes (✅ Fixed: plural 'questions')
app.use('/api/questions', require('./routes/question'));

// ➤ Other Routes
const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

const questionLogRoutes = require('./routes/questionLog');
app.use('/api/question-log', questionLogRoutes);

const progressRoutes = require('./routes/progress');
app.use('/api/progress', progressRoutes);

const expressionRoutes = require('./routes/expression');
app.use('/api/expression', expressionRoutes);

const predictRoutes = require("./routes/predict");
app.use("/api/predict", predictRoutes);

const nextQuestionRoutes = require("./routes/nextQuestion");
app.use("/api/next-question", nextQuestionRoutes);

const feedbackRoutes = require('./routes/feedback');
app.use('/api/feedback', feedbackRoutes);

const suggestionsRoutes = require('./routes/suggestions');
app.use('/api/suggestions', suggestionsRoutes);

// ➤ Temp: Create User API (already present)
app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➤ Temp: Get all users (already present)
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
