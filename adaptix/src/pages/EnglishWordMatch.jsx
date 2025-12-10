// EnglishWordMatch.jsx
import React, { useState, useEffect } from 'react';
import './EnglishWordMatch.css';
import FaceEmotionDetector from '../components/FaceEmotionDetector';
import { useProgress } from './ProgressContext';
import englishacttwo from './englishacttwo';

function mapEmotion(rawEmotion) {
  if (!rawEmotion || rawEmotion.includes('No face') || rawEmotion.includes('Error')) return 'neutral';
  const e = rawEmotion.toLowerCase();
  if (e.includes('happy')) return 'happy';
  if (e.includes('sad')) return 'sad';
  return 'neutral';
}

function EnglishWordMatch() {
  const [currentQ, setCurrentQ] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [liveEmotion, setLiveEmotion] = useState('neutral');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const { refreshProgress } = useProgress();
  const MAX_QUESTIONS = 5;

  // Helper to get next question based on logic
  const getNextQuestion = (prevCorrect, emotion, history) => {
    let level = 'Easy';
    if (prevCorrect && emotion === 'happy') level = 'Hard';
    else if (prevCorrect && emotion === 'neutral') level = 'Medium';
    else if (!prevCorrect || emotion === 'sad') level = 'Easy';
    // Filter out already asked questions
    const candidates = englishacttwo.filter(q => q.level === level && !history.includes(q.question));
    if (candidates.length === 0) return null;
    // Pick random from candidates
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  // Start quiz with an Easy question
  useEffect(() => {
    const firstQ = getNextQuestion(false, 'sad', []); // always Easy
    setCurrentQ(firstQ);
    setQuestionHistory(firstQ ? [firstQ.question] : []);
    setScore(0);
    setShowScore(false);
    setCompleted(false);
    setLastAnswerCorrect(null);
  }, []);

  const handleAnswer = (option) => {
    const correct = currentQ && currentQ.options[currentQ.answer.charCodeAt(0) - 65] === option;
    setLastAnswerCorrect(correct);
    if (correct) setScore(s => s + 1);
    setShowScore(true);
  };

  const handleNextQuestion = () => {
    const emotion = mapEmotion(liveEmotion);
    const nextQ = getNextQuestion(lastAnswerCorrect, emotion, questionHistory);
    if (nextQ && questionHistory.length < MAX_QUESTIONS) {
      setCurrentQ(nextQ);
      setQuestionHistory(h => [...h, nextQ.question]);
      setShowScore(false);
      setLastAnswerCorrect(null);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    const firstQ = getNextQuestion(false, 'sad', []);
    setCurrentQ(firstQ);
    setQuestionHistory(firstQ ? [firstQ.question] : []);
    setScore(0);
    setShowScore(false);
    setCompleted(false);
    setLastAnswerCorrect(null);
  };

  useEffect(() => {
    if (completed) {
      // Mark activity complete
      const markActivityComplete = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        let progressData = {};
        try {
          const res = await fetch(`/api/progress/${userId}`);
          progressData = await res.json();
        } catch (e) {
          progressData = {};
        }
        if (!progressData['English']) progressData['English'] = [];
        if (!progressData['English'].includes('WordMatch')) {
          progressData['English'].push('WordMatch');
          await fetch(`/api/progress/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: progressData })
          });
          refreshProgress();
        }
      };
      markActivityComplete();
    }
  }, [completed, refreshProgress]);

  if (completed) {
    return (
      <div className="word-match-container">
        <h2>Game Over!</h2>
        <p>Your Score: {score} / {questionHistory.length}</p>
        <button onClick={handleRestart}>Restart Game</button>
      </div>
    );
  }

  if (!currentQ) {
    return <div className="word-match-container"><h2>No questions available.</h2></div>;
  }

  return (
    <div className="word-match-container">
      <h2 className="word-match-title">Word Match Game</h2>
      <div style={{ marginBottom: 16 }}>
        <b>Current emotion:</b> {mapEmotion(liveEmotion)}
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Question {questionHistory.length}:</b> {currentQ.level} level
      </div>
      {showScore ? (
        <div className="score-section">
          {lastAnswerCorrect ? 'Correct!' : 'Wrong!'}<br />
          Correct answer: {currentQ.options[currentQ.answer.charCodeAt(0) - 65]}
          <br />
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      ) : (
        <div className="question-section">
          <p className="word-match-question">
            Match the word <strong>"{currentQ.question.replace('Word: ', '')}"</strong> with its synonym:
          </p>
          <div className="word-options">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className="word-option"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      <FaceEmotionDetector onEmotionChange={setLiveEmotion} />
    </div>
  );
}

export default EnglishWordMatch;
