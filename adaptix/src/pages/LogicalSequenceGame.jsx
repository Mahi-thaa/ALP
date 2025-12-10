import React, { useState, useEffect } from 'react';
import './LogicalSequenceGame.css';
import FaceEmotionDetector from '../components/FaceEmotionDetector';
import { lractthree } from './lractthree';
import { useProgress } from './ProgressContext';

function shuffle(array) {
  // Fisher-Yates shuffle
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function LogicalSequenceGame() {
  const [questionSet, setQuestionSet] = useState('easy');
  const [usedIndexes, setUsedIndexes] = useState({ easy: [], medium: [], hard: [] });
  const [currentQ, setCurrentQ] = useState(null);
  const [shuffledSteps, setShuffledSteps] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [latestEmotion, setLatestEmotion] = useState('neutral');
  const [feedback, setFeedback] = useState('');
  const { refreshProgress } = useProgress();

  const getRandomQuestion = (questions, usedIndexes) => {
    const available = questions
      .map((q, idx) => ({ q, idx }))
      .filter(({ idx }) => !usedIndexes.includes(idx));
    if (available.length === 0) return null;
    const { q, idx } = available[Math.floor(Math.random() * available.length)];
    return { ...q, idx };
  };

  useEffect(() => {
    // Start with an Easy question
    const q = getRandomQuestion(lractthree.easy, usedIndexes.easy) || null;
    setCurrentQ(q ? { ...q, difficulty: 'easy' } : null);
    setQuestionSet('easy');
    setQuestionCount(1);
    setUsedIndexes({ easy: q ? [q.idx] : [], medium: [], hard: [] });
    setUserOrder([]);
    setShowResult(false);
    setScore(0);
    setFeedback('');
    if (q) setShuffledSteps(shuffle(q.steps));
  }, []);

  useEffect(() => {
    if (showResult) {
      markActivityComplete('Logical Reasoning', 'SequenceGame');
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

  const handleStepClick = (step) => {
    if (userOrder.includes(step)) return;
    const updated = [...userOrder, step];
    setUserOrder(updated);
    if (updated.length === currentQ.correctOrder.length) {
      const isCorrect = updated.every((s, i) => s === currentQ.correctOrder[i]);
      setFeedback(isCorrect ? '✅ Correct Sequence!' : '❌ Wrong!');
      if (isCorrect) setScore(score + 1);
    }
  };

  const handleNext = () => {
    const isCorrect = userOrder.length === currentQ.correctOrder.length && userOrder.every((s, i) => s === currentQ.correctOrder[i]);
    if (questionCount >= 5) {
      setShowResult(true);
      return;
    }
    // Determine next difficulty
    const nextDifficulty = getNextDifficulty(isCorrect, latestEmotion);
    const nextUsed = { ...usedIndexes };
    nextUsed[currentQ.difficulty] = [...nextUsed[currentQ.difficulty], currentQ.idx];
    const nextQ = getRandomQuestion(lractthree[nextDifficulty], nextUsed[nextDifficulty]);
    if (nextQ) {
      setCurrentQ({ ...nextQ, difficulty: nextDifficulty });
      setUsedIndexes(nextUsed);
      setQuestionSet(nextDifficulty);
      setQuestionCount(questionCount + 1);
      setUserOrder([]);
      setFeedback('');
      setShuffledSteps(shuffle(nextQ.steps));
    } else {
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
    <div className="sequence-container">
      <h2>Sequence Game</h2>
      <p>{currentQ.instruction}</p>
      {!showResult ? (
        <>
          <div className="options">
            {shuffledSteps.map((step, index) => (
              <button key={index} className="sequence-btn" onClick={() => handleStepClick(step)} disabled={userOrder.includes(step)}>
                {step}
              </button>
            ))}
          </div>
          <div className="selected-steps">
            {userOrder.map((step, i) => (
              <div key={i} className="selected-step">{step}</div>
            ))}
          </div>
          <div className="feedback">{feedback}</div>
          {feedback && (
            <button className="next-btn" onClick={handleNext}>
              {questionCount === 5 ? 'Finish' : 'Next'}
            </button>
          )}
        </>
      ) : (
        <div className="result-box">
          <h2>🎉 You scored {score} out of {questionCount}!</h2>
        </div>
      )}
      <FaceEmotionDetector onEmotion={handleEmotion} />
    </div>
  );
}

export default LogicalSequenceGame;

