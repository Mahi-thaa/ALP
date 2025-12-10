import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const WebcamPredictor = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const capture = React.useCallback(() => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
    setPrediction(null);
    setError(null);
  }, [webcamRef]);

  const sendForPrediction = async () => {
    if (!imageSrc) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc })
      });
      const data = await response.json();
      setPrediction(data.prediction || JSON.stringify(data));
    } catch (err) {
      setError('Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Webcam Emotion Predictor</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        width={320}
        height={240}
        style={{ marginBottom: 10 }}
      />
      <div>
        <button onClick={capture}>Capture</button>
        <button onClick={sendForPrediction} disabled={!imageSrc || loading} style={{ marginLeft: 8 }}>
          {loading ? 'Predicting...' : 'Predict Emotion'}
        </button>
      </div>
      {imageSrc && (
        <div style={{ marginTop: 10 }}>
          <img src={imageSrc} alt="Captured" width={160} />
        </div>
      )}
      {prediction && (
        <div style={{ marginTop: 10 }}>
          <strong>Prediction:</strong> {prediction}
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </div>
  );
};

export default WebcamPredictor; 