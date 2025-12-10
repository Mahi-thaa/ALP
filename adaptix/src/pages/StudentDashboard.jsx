import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';
import { FaBook, FaPuzzlePiece, FaChartLine } from 'react-icons/fa';
import FaceEmotionDetector from '../components/FaceEmotionDetector';
import { activitiesData } from './Activities';
import { useProgress } from './ProgressContext';

const subjects = ['English', 'Math', 'Logical Reasoning'];

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { progress, refreshProgress, loading } = useProgress();
  const [showProgress, setShowProgress] = useState(false); // toggle progress tracker
  const [feedbacks, setFeedbacks] = useState([]);
  const [parentSuggestions, setParentSuggestions] = useState([]);

  const studentId = JSON.parse(localStorage.getItem('currentUser'))?.id;

  useEffect(() => {
    if (!studentId) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/feedback/${studentId}`);
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Feedback API did not return JSON:', text);
          setFeedbacks([]);
          return;
        }
        setFeedbacks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setFeedbacks([]);
      }
    })();
  }, [studentId]);

  // Fetch parent suggestions
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user?.email) return;
    fetch(`${API_BASE_URL}/api/suggestions?to=${user.email}&role=parent`)
      .then(res => res.json())
      .then(data => setParentSuggestions(Array.isArray(data) ? data : []));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="student-dashboard">
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <h1 className="dashboard-heading">Welcome, Learner!</h1>
      <p className="dashboard-subheading">Let's Make Today Count!</p>

      <div className="dashboard-icons">
        <div className="dashboard-card" onClick={() => navigate('/learning-modules')}>
          <FaBook className="icon" />
          <span>Learning Modules</span>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/activities')}>
          <FaPuzzlePiece className="icon" />
          <span>Activities</span>
        </div>

        <div className="dashboard-card" onClick={() => setShowProgress(!showProgress)}>
          <FaChartLine className="icon" />
          <span>Progress Tracker</span>
        </div>
      </div>

      {/* Show progress tracker only if toggled */}
      {showProgress && (
        <div className="progress-section">
          <h2>Progress Tracker</h2>
          <button onClick={refreshProgress} disabled={loading} style={{ marginBottom: 12 }}>
            {loading ? 'Refreshing...' : 'Refresh Progress'}
          </button>
          {Object.keys(activitiesData).map(subject => {
            const total = activitiesData[subject].length;
            const completed = (progress[subject] || []).length;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <div key={subject} style={{ marginBottom: 18 }}>
                <p style={{ marginBottom: 6 }}>
                  <strong>{subject}:</strong> {completed} / {total} activities completed
                </p>
                <div className="progress-bar">
                  <div className="fill" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback Section */}
      <div className="progress-section" style={{ marginTop: 24 }}>
        <h2>Feedback from Therapists</h2>
        {feedbacks.length === 0 ? (
          <div>No feedback yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {feedbacks.map((fb, idx) => (
              <li key={idx} style={{ marginBottom: 16, background: '#f9f9ff', borderRadius: 8, padding: 12, boxShadow: '0 2px 8px rgba(124,58,237,0.04)' }}>
                <div style={{ fontWeight: 600, color: '#7c3aed' }}>{fb.therapistName || 'Therapist'}</div>
                <div style={{ margin: '6px 0' }}>{fb.message}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{new Date(fb.timestamp).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Suggestions from Parent Section */}
      <div className="progress-section" style={{ marginTop: 24 }}>
        <h2>Suggestions from Parent</h2>
        {parentSuggestions.length === 0 ? (
          <div>No suggestions from parent yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {parentSuggestions.map((sug, idx) => (
              <li key={idx} style={{ marginBottom: 16, background: '#e6f7ff', borderRadius: 8, padding: 12, boxShadow: '0 2px 8px rgba(58,124,237,0.04)' }}>
                <div style={{ fontWeight: 600, color: '#0077b6' }}>{sug.from}</div>
                <div style={{ margin: '6px 0' }}>{sug.message}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{new Date(sug.timestamp).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Webcam-only view at bottom right */}
      <div className="emotion-detector-box">
        <FaceEmotionDetector />
      </div>
    </div>
  );
};

export default StudentDashboard;
