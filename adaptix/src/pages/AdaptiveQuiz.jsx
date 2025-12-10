import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// For demo: hardcode userId and topic
const USER_ID = 'demoUserId'; // Replace with actual user ID from login/session
const TOPIC = 'math';

const AdaptiveQuiz = () => {
  const webcamRef = useRef(null);
  const [question, setQuestion] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  // Demo question for testing
  const demoQuestion = {
    questionText: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    difficulty: "easy",
    topic: "math"
  };

  // Capture webcam image and get emotion
  const captureAndPredict = async () => {
    if (!webcamRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      // 1. Get emotion from backend
      const predRes = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc })
      });
      const predData = await predRes.json();
      setEmotion(predData.prediction);
      
      // 2. Get next question from backend
      const qRes = await fetch(`${API_BASE_URL}/api/next-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, emotion: predData.prediction, topic: TOPIC })
      });
      const qData = await qRes.json();
      if (qData.question) {
        setQuestion(qData.question);
      } else {
        setError(qData.error || 'No question found');
        setDemoMode(true);
        setQuestion(demoQuestion);
      }
    } catch (err) {
      setError('Failed to get question - using demo mode');
      setDemoMode(true);
      setQuestion(demoQuestion);
    } finally {
      setLoading(false);
    }
  };

  // On mount, fetch the first question (no emotion yet)
  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const qRes = await fetch(`${API_BASE_URL}/api/next-question`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: USER_ID, emotion: 'neutral', topic: TOPIC })
        });
        const qData = await qRes.json();
        if (qData.question) {
          setQuestion(qData.question);
        } else {
          setError(qData.error || 'No question found - using demo mode');
          setDemoMode(true);
          setQuestion(demoQuestion);
        }
      } catch (err) {
        setError('Failed to get question - using demo mode');
        setDemoMode(true);
        setQuestion(demoQuestion);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: 32 }}>
      <h2>Adaptive Quiz</h2>
      {demoMode && (
        <div style={{ background: '#fff3cd', padding: 10, marginBottom: 16, borderRadius: 4 }}>
          <strong>Demo Mode:</strong> Using sample question since no questions found in database.
        </div>
      )}
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {question && (
        <div style={{ marginBottom: 32 }}>
          <h3>{question.questionText}</h3>
          <ul>
            {question.options.map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
          <div style={{ marginTop: 16 }}>
            <button onClick={captureAndPredict} disabled={loading}>
              Next (Capture Expression & Get Next Question)
            </button>
          </div>
        </div>
      )}
      {emotion && (
        <div style={{ marginBottom: 16 }}>
          <strong>Last detected emotion:</strong> {emotion}
        </div>
      )}
      {/* Webcam in bottom right */}
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000, border: '2px solid #ccc', borderRadius: 8, background: '#fff' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          width={180}
          height={135}
        />
      </div>
    </div>
  );
};

export default AdaptiveQuiz; 