/*import React, { useEffect, useRef } from 'react';

const FaceEmotionDetector = () => {
  const videoRef = useRef();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access error:", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay muted style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default FaceEmotionDetector;*/
/*
import React, { useEffect, useRef, useState } from 'react';

const FaceEmotionDetector = ({ onEmotionChange }) => {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access error:", error);
      }
    };

    startCamera();

    // Cleanup: stop the camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const [emotion, setEmotion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let intervalId;
    const captureAndSend = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Draw the current video frame to the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get the image as base64
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setLoading(true);
      
      try {
        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl })
        });
        
        if (response.ok) {
          let data;
          try {
            data = await response.json();
          } catch (e) {
            console.error("Prediction error:", e);
            return;
          }
          setEmotion(data.prediction || 'No face detected');
          if (onEmotionChange) onEmotionChange(data.prediction || 'No face detected');
        } else {
          const errorData = await response.json();
          setEmotion(errorData.error || 'Error');
          if (onEmotionChange) onEmotionChange(errorData.error || 'Error');
        }
      } catch (err) {
        console.error('Prediction error:', err);
        setEmotion('Connection error');
        if (onEmotionChange) onEmotionChange('Connection error');
      } finally {
        setLoading(false);
      }
    };

    // Start interval when video is ready
    if (videoRef.current) {
      intervalId = setInterval(captureAndSend, 2000); // every 2 seconds
    }
    
    return () => clearInterval(intervalId);
  }, [onEmotionChange]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{
          position: 'fixed',
          bottom: '15px',
          right: '15px',
          width: '180px',
          height: '120px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          objectFit: 'cover',
          zIndex: 999,
        }}
              />
        {/* Hidden canvas for capturing frames 
        <canvas
          ref={canvasRef}
          width={180}
          height={120}
          style={{ display: 'none' }}
        />
        {/* Emotion display *
      <div
        style={{
          position: 'fixed',
          bottom: '145px',
          right: '15px',
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '1.1em',
          zIndex: 1000,
          minWidth: '120px',
          textAlign: 'center',
        }}
      >
        {loading ? 'Detecting...' : (emotion ? `Emotion: ${emotion}` : 'No face detected')}
      </div>
    </>
  );
};

export default FaceEmotionDetector;

*/
/*

import React, { useState, useEffect, useRef } from 'react';
import FaceEmotionDetector from '../components/FaceEmotionDetector';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Map detected emotion to one of: happy, sad, neutral
function mapEmotion(rawEmotion) {
  if (!rawEmotion || rawEmotion === 'No face detected' || rawEmotion === 'Error' || rawEmotion === 'Connection error') return 'neutral';
  const e = rawEmotion.toLowerCase();
  if (e.includes('happy')) return 'happy';
  if (e.includes('sad')) return 'sad';
  return 'neutral';
}

function EnglishMCQ() {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [lockedEmotion, setLockedEmotion] = useState(null);
  const [liveEmotion, setLiveEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const emotionSetRef = useRef(false);

  const fetchQuestions = async (emotionLevel) => {
    setLoading(true);
    setError(null);
    try {
      const mappedEmotion = mapEmotion(emotionLevel);
      const response = await fetch(`${API_BASE_URL}/api/questions/english-questions/${mappedEmotion}`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const questions = await response.json();
      if (questions.length === 0) {
        setError('No questions available for this emotion.');
      }
      return questions;
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!quizStarted && emotion && !emotionSetRef.current) {
      const setupQuiz = async () => {
        const questions = await fetchQuestions(emotion);
        if (questions.length > 0) {
          setQuizQuestions(questions);
          setCurrentQ(0);
          setScore(0);
          setShowScore(false);
          setCompleted(false);
          setQuizStarted(true);
          const locked = mapEmotion(emotion);
          setLockedEmotion(locked);
          console.log('✅ Emotion locked for quiz:', locked);
          emotionSetRef.current = true;
        }
      };
      setupQuiz();
    }
  }, [emotion, quizStarted]);

  const handleAnswer = (option) => {
    if (quizQuestions[currentQ] && option === quizQuestions[currentQ].answer) {
      setScore(score + 1);
    }
    setShowScore(true);
  };

  const handleNextQuestion = () => {
    if (currentQ + 1 < quizQuestions.length) {
      setCurrentQ(currentQ + 1);
      setShowScore(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setQuizQuestions([]);
    setCurrentQ(0);
    setScore(0);
    setShowScore(false);
    setEmotion(null);
    setQuizStarted(false);
    setCompleted(false);
    setLockedEmotion(null);
    setLiveEmotion(null);
    setError(null);
    emotionSetRef.current = false;
  };

  const markActivityComplete = (subject, activityName) => {
    const progressData = JSON.parse(localStorage.getItem('progress')) || {};
    if (!progressData[subject]) {
      progressData[subject] = [];
    }
    if (!progressData[subject].includes(activityName)) {
      progressData[subject].push(activityName);
      localStorage.setItem('progress', JSON.stringify(progressData));
    }
  };

  useEffect(() => {
    if (showScore) {
      markActivityComplete('English', 'MCQ');
    }
  }, [showScore]);

  if (loading) {
    return (
      <div className="mcq-container">
        <h2>Loading questions...</h2>
        <div>Detecting your emotion to provide the right questions for you.</div>
        <FaceEmotionDetector onEmotionChange={(emo) => {
          console.log("🔁 Detected Emotion:", emo);
          setEmotion(emo);
        }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mcq-container">
        <h2>Error: {error}</h2>
        <button onClick={handleRestart}>Try Again</button>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="mcq-container">
        <h2>Detecting your emotion... Please look at the camera.</h2>
        <div>We'll provide questions that match your current mood!</div>
        <FaceEmotionDetector onEmotionChange={(emo) => {
          console.log("🔁 Emotion before quiz start:", emo);
          setEmotion(emo);
        }} />
      </div>
    );
  }

  if (completed) {
    return (
      <div className="mcq-container">
        <h2>Quiz completed!</h2>
        <div>Your score: {score} / {quizQuestions.length}</div>
        <button onClick={handleRestart}>Restart Quiz</button>
      </div>
    );
  }

  if (!quizQuestions.length) {
    return (
      <div className="mcq-container">
        <h2>No questions available for this emotion/difficulty.</h2>
        <button onClick={handleRestart}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="mcq-container" style={{ position: 'relative' }}>
      <h1>English MCQ Game</h1>
      <div style={{ marginBottom: 16 }}>
        Emotion for this quiz: <b>{lockedEmotion}</b>
        {lockedEmotion === 'sad' && ' (Easy questions)'}
        {lockedEmotion === 'neutral' && ' (Medium questions)'}
        {lockedEmotion === 'happy' && ' (Hard questions)'}
      </div>

      {/* Live emotion display in top right }
      <div style={{
        position: 'absolute',
        top: 18,
        right: 24,
        background: 'rgba(255,255,255,0.85)',
        color: '#7c3aed',
        padding: '8px 18px',
        borderRadius: 12,
        fontWeight: 700,
        fontSize: '1.1rem',
        boxShadow: '0 2px 8px rgba(124,58,237,0.08)',
        zIndex: 10
      }}>
        {['Error', 'Connection error', 'No face detected'].includes(liveEmotion)
          ? 'Detecting emotion...'
          : `Current emotion: ${liveEmotion}`}
      </div>

      {showScore ? (
        <div className="score-section">
          <p>Correct answer: <b>{quizQuestions[currentQ].answer}</b></p>
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      ) : (
        <div className="question-section">
          <h2>{quizQuestions[currentQ].question}</h2>
          <div className="options">
            {quizQuestions[currentQ].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live FaceEmotionDetector to show real-time emotion }
      <FaceEmotionDetector onEmotionChange={(emo) => {
        console.log("📸 Live emotion detected:", emo);
        setLiveEmotion(emo);
      }} />
    </div>
  );
}

export default EnglishMCQ;
*/
/*

import React, { useState, useEffect, useRef } from 'react';
import FaceEmotionDetector from '../components/FaceEmotionDetector';
import './EnglishMCQ.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function mapEmotion(rawEmotion) {
  if (!rawEmotion || rawEmotion === 'No face detected' || rawEmotion === 'Error' || rawEmotion === 'Connection error') return 'neutral';
  const e = rawEmotion.toLowerCase();
  if (e.includes('happy')) return 'happy';
  if (e.includes('sad')) return 'sad';
  return 'neutral';
}

function EnglishMCQ() {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [emotion, setEmotion] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [lockedEmotion, setLockedEmotion] = useState(null);
  const [liveEmotion, setLiveEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const emotionSetRef = useRef(false);

  const fetchQuestions = async (emotionLevel) => {
    setLoading(true);
    setError(null);
    try {
      const mappedEmotion = mapEmotion(emotionLevel);
      const response = await fetch(`${API_BASE_URL}/api/questions/english-questions/${mappedEmotion}`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      const questions = await response.json();
      if (questions.length === 0) {
        setError('No questions available for this emotion.');
      }
      return questions;
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // FIXED LOGIC: Delay 2s before locking emotion
  useEffect(() => {
    let timeout;
    if (!quizStarted && emotion && !emotionSetRef.current) {
      const mapped = mapEmotion(emotion);
      timeout = setTimeout(async () => {
        const questions = await fetchQuestions(mapped);
        if (questions.length > 0) {
          setQuizQuestions(questions);
          setCurrentQ(0);
          setScore(0);
          setShowScore(false);
          setCompleted(false);
          setQuizStarted(true);
          setLockedEmotion(mapped);
          emotionSetRef.current = true;
        }
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [emotion, quizStarted]);

  const handleAnswer = (option) => {
    if (quizQuestions[currentQ] && option === quizQuestions[currentQ].answer) {
      setScore(score + 1);
    }
    setShowScore(true);
  };

  const handleNextQuestion = () => {
    if (currentQ + 1 < quizQuestions.length) {
      setCurrentQ(currentQ + 1);
      setShowScore(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setQuizQuestions([]);
    setCurrentQ(0);
    setScore(0);
    setShowScore(false);
    setEmotion(null);
    setQuizStarted(false);
    setCompleted(false);
    setLockedEmotion(null);
    setLiveEmotion(null);
    setError(null);
    emotionSetRef.current = false;
  };

  const markActivityComplete = (subject, activityName) => {
    const progressData = JSON.parse(localStorage.getItem('progress')) || {};
    if (!progressData[subject]) progressData[subject] = [];
    if (!progressData[subject].includes(activityName)) {
      progressData[subject].push(activityName);
      localStorage.setItem('progress', JSON.stringify(progressData));
    }
  };

  useEffect(() => {
    if (showScore) markActivityComplete('English', 'MCQ');
  }, [showScore]);

  if (loading) {
    return (
      <div className="mcq-container">
        <h2>Loading questions...</h2>
        <div>Detecting your emotion to provide the right questions for you.</div>
        <FaceEmotionDetector onEmotionChange={setEmotion} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mcq-container">
        <h2>Error: {error}</h2>
        <button onClick={handleRestart}>Try Again</button>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="mcq-container">
        <h2>Detecting your emotion... Please look at the camera.</h2>
        <div>We'll provide questions that match your current mood!</div>
        <FaceEmotionDetector onEmotionChange={setEmotion} />
      </div>
    );
  }

  if (completed) {
    return (
      <div className="mcq-container">
        <h2>Quiz completed!</h2>
        <div>Your score: {score} / {quizQuestions.length}</div>
        <button onClick={handleRestart}>Restart Quiz</button>
      </div>
    );
  }

  if (!quizQuestions.length) {
    return (
      <div className="mcq-container">
        <h2>No questions available for this emotion/difficulty.</h2>
        <button onClick={handleRestart}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="mcq-container" style={{ position: 'relative' }}>
      <h1>English MCQ Game</h1>
      <div style={{ marginBottom: 16 }}>
        Emotion for this quiz: <b>{lockedEmotion}</b>
        {lockedEmotion === 'sad' && ' (Easy questions)'}
        {lockedEmotion === 'neutral' && ' (Medium questions)'}
        {lockedEmotion === 'happy' && ' (Hard questions)'}
      </div>

      <div style={{
        position: 'absolute',
        top: 18,
        right: 24,
        background: 'rgba(255,255,255,0.85)',
        color: '#7c3aed',
        padding: '8px 18px',
        borderRadius: 12,
        fontWeight: 700,
        fontSize: '1.1rem',
        boxShadow: '0 2px 8px rgba(124,58,237,0.08)',
        zIndex: 10
      }}>
        {liveEmotion ? `Current emotion: ${liveEmotion}` : 'Detecting emotion...'}
      </div>

      {showScore ? (
        <div className="score-section">
          {quizQuestions[currentQ] && `Correct answer: ${quizQuestions[currentQ].answer}`}
          <br />
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      ) : (
        <div className="question-section">
          <h2>{quizQuestions[currentQ].question}</h2>
          <div className="options">
            {quizQuestions[currentQ].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(option)}>
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

export default EnglishMCQ;
*/


import React, { useEffect, useRef, useState } from 'react';

const FaceEmotionDetector = ({ onEmotionChange }) => {
  const videoRef = useRef();
  const canvasRef = useRef();

  const [emotion, setEmotion] = useState('');
  const [loading, setLoading] = useState(false);

  // Start camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera access error:", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Send video frame every 2 seconds
  useEffect(() => {
    let intervalId;

    const captureAndSend = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setLoading(true);

      try {
        const response = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataUrl })
        });

        if (response.ok) {
          const data = await response.json();
          const detected = data.prediction || 'No face detected';
          setEmotion(detected);
          if (onEmotionChange) onEmotionChange(detected);
        } else {
          const err = await response.json();
          const fallback = err.error || 'Error';
          setEmotion(fallback);
          if (onEmotionChange) onEmotionChange(fallback);
        }
      } catch (err) {
        console.error('Prediction error:', err);
        setEmotion('Connection error');
        if (onEmotionChange) onEmotionChange('Connection error');
      } finally {
        setLoading(false);
      }
    };

    intervalId = setInterval(captureAndSend, 2000); // Every 2 seconds

    return () => clearInterval(intervalId);
  }, [onEmotionChange]);

  return (
    <>
      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{
          position: 'fixed',
          bottom: '15px',
          right: '15px',
          width: '180px',
          height: '120px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          objectFit: 'cover',
          zIndex: 999,
        }}
      />

      {/* Hidden Canvas */}
      <canvas
        ref={canvasRef}
        width={180}
        height={120}
        style={{ display: 'none' }}
      />

      {/* Emotion Display */}
      <div
        style={{
          position: 'fixed',
          bottom: '145px',
          right: '15px',
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '1.1em',
          zIndex: 1000,
          minWidth: '120px',
          textAlign: 'center',
        }}
      >
        {loading ? 'Detecting...' : (emotion ? `Emotion: ${emotion}` : 'No face detected')}
      </div>
    </>
  );
};

export default FaceEmotionDetector;
