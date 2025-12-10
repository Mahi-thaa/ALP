import React, { useState, useEffect, useRef } from 'react';
import FaceEmotionDetector from '../components/FaceEmotionDetector';
import './EnglishMCQ.css';
import { useProgress } from './ProgressContext';
import englishactone from './englishactone';

function mapEmotion(rawEmotion) {
  if (!rawEmotion || rawEmotion.includes('No face') || rawEmotion.includes('Error')) return 'neutral';
  const e = rawEmotion.toLowerCase();
  if (e.includes('happy')) return 'happy';
  if (e.includes('sad')) return 'sad';
  return 'neutral';
}

function EnglishMCQ() {
  const [currentQ, setCurrentQ] = useState(null); // current question object
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [liveEmotion, setLiveEmotion] = useState('neutral');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]); // store asked questions
  const { refreshProgress } = useProgress();
  const MAX_QUESTIONS = 5;

  // Helper to get next question based on logic
  const getNextQuestion = (prevCorrect, emotion, history) => {
    let level = 'Easy';
    if (prevCorrect && emotion === 'happy') level = 'Hard';
    else if (prevCorrect && emotion === 'neutral') level = 'Medium';
    else if (!prevCorrect || emotion === 'sad') level = 'Easy';
    // Filter out already asked questions
    const candidates = englishactone.filter(q => q.level === level && !history.includes(q.question));
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
    // Use latest emotion and last answer correctness
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
        if (!progressData['English'].includes('MCQ')) {
          progressData['English'].push('MCQ');
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
      <div className="mcq-container">
        <h2>Quiz Completed!</h2>
        <div>Your score: {score} / {questionHistory.length}</div>
        <button onClick={handleRestart}>Restart Quiz</button>
      </div>
    );
  }

  if (!currentQ) {
    return <div className="mcq-container"><h2>No questions available.</h2></div>;
  }

  return (
    <div className="mcq-container" style={{ position: 'relative' }}>
      <h1>English MCQ Quiz</h1>
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
          <h2>{currentQ.question}</h2>
          <div className="options">
            {currentQ.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
      <FaceEmotionDetector onEmotionChange={setLiveEmotion} />
    </div>
  );
}

export default EnglishMCQ;
