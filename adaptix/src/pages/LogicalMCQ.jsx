// LogicalMCQ.jsx
import React, { useState, useEffect } from 'react';
import './LogicalMCQ.css';
import FaceEmotionDetector from '../components/FaceEmotionDetector';
import { lractone } from './lractone';
import { useProgress } from './ProgressContext';

const getRandomQuestion = (questions, usedIndexes) => {
  const available = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ idx }) => !usedIndexes.includes(idx));
  if (available.length === 0) return null;
  const { q, idx } = available[Math.floor(Math.random() * available.length)];
  return { ...q, idx };
};

function LogicalMCQ() {
  const [questionSet, setQuestionSet] = useState('easy');
  const [usedIndexes, setUsedIndexes] = useState({ easy: [], medium: [], hard: [] });
  const [currentQ, setCurrentQ] = useState(null);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [latestEmotion, setLatestEmotion] = useState('neutral');
  const { refreshProgress } = useProgress();

  useEffect(() => {
    // Start with an Easy question
    const q = getRandomQuestion(lractone.easy, usedIndexes.easy) || null;
    setCurrentQ(q ? { ...q, difficulty: 'easy' } : null);
    setQuestionSet('easy');
    setQuestionCount(1);
    setUsedIndexes({ easy: q ? [q.idx] : [], medium: [], hard: [] });
    setSelected(null);
    setShowResult(false);
    setScore(0);
  }, []);

  useEffect(() => {
    if (showResult) {
      markActivityComplete('Logical Reasoning', 'MCQ');
    }
  }, [showResult]);

  const handleEmotion = (emotion) => {
    setLatestEmotion(emotion);
  };

  const getNextDifficulty = (isCorrect, emotion) => {
    if (!isCorrect || emotion === 'sad') return 'easy';
    if (emotion === 'happy') return 'hard';
    return 'medium';
  };

  const handleSubmit = () => {
    const isCorrect = selected === currentQ.options[currentQ.answer.charCodeAt(0) - 65];
    if (isCorrect) setScore(score + 1);
    if (questionCount >= 5) {
      setShowResult(true);
      return;
    }
    // Determine next difficulty
    const nextDifficulty = getNextDifficulty(isCorrect, latestEmotion);
    const nextUsed = { ...usedIndexes };
    nextUsed[currentQ.difficulty] = [...nextUsed[currentQ.difficulty], currentQ.idx];
    const nextQ = getRandomQuestion(lractone[nextDifficulty], nextUsed[nextDifficulty]);
    if (nextQ) {
      setCurrentQ({ ...nextQ, difficulty: nextDifficulty });
      setUsedIndexes(nextUsed);
      setQuestionSet(nextDifficulty);
      setQuestionCount(questionCount + 1);
      setSelected(null);
    } else {
      // If no more questions in that difficulty, end quiz
      setShowResult(true);
    }
  };

  const markActivityComplete = async (subject, activityName) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    let progressData = {};
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/progress/${userId}`);
      progressData = await res.json();
    } catch (e) {
      progressData = {};
    }
    if (!progressData[subject]) {
      progressData[subject] = [];
    }
    if (!progressData[subject].includes(activityName)) {
      progressData[subject].push(activityName);
      await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/progress/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: progressData })
      });
      refreshProgress();
    }
  };

  if (!currentQ) return <div>Loading...</div>;

  return (
    <div className="logical-mcq-container">
      <h1>🧠 Logical Reasoning MCQ</h1>
      {!showResult ? (
        <div className="quiz-box">
          <h3>Q{questionCount}: {currentQ.question}</h3>
          <div className="options">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                className={`option-btn ${selected === option ? 'selected' : ''}`}
                onClick={() => setSelected(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button className="submit-btn" onClick={handleSubmit} disabled={!selected}>
            {questionCount === 5 ? 'Finish' : 'Next'}
          </button>
        </div>
      ) : (
        <div className="result-box">
          <h2>🎉 You scored {score} out of {questionCount}!</h2>
        </div>
      )}
      <FaceEmotionDetector onEmotion={handleEmotion} />
    </div>
  );
}

export default LogicalMCQ;
