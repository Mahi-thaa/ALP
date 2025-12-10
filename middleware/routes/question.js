const express = require("express");
const router = express.Router();
// Only import the local English MCQ array
const englishMCQ = require("../englishMCQ");

// Route: /english-questions/:emotion (local array, no DB)
router.get("/english-questions/:emotion", (req, res) => {
  const emotion = req.params.emotion?.toLowerCase();
  let level;
  if (emotion === "sad") level = "Easy";
  else if (emotion === "happy") level = "Hard";
  else level = "Medium";

  // Filter for subject: English, type: MCQ, and mapped level
  const filtered = englishMCQ.filter(q =>
    q.subject === "English" &&
    q.type === "MCQ" &&
    q.level === level
  );

  // Pick 5 random questions
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 5);
  res.json(selected);
});

module.exports = router;
