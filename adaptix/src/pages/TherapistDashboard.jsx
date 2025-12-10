import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TherapistDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const TherapistDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [students, setStudents] = useState([]);
  const [progress, setProgress] = useState({});
  const [feedback, setFeedback] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [loading, setLoading] = useState(false);

  // Get therapistId from localStorage
  const therapistId = JSON.parse(localStorage.getItem('currentUser'))?.id;

  useEffect(() => {
    // Fetch all students
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/students`);
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Students API did not return JSON:', text);
          setStudents([]);
          setLoading(false);
          return;
        }
        setStudents(data);
        setLoading(false);
        // Fetch progress for each student
        data.forEach(async student => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/progress/${student.id || student._id}`);
            const text = await res.text();
            let prog;
            try {
              prog = JSON.parse(text);
            } catch (e) {
              console.error('Progress API did not return JSON:', text);
              prog = {};
            }
            setProgress(prev => ({ ...prev, [student.id || student._id]: prog }));
          } catch (err) {
            console.error('Error fetching progress:', err);
            setProgress(prev => ({ ...prev, [student.id || student._id]: {} }));
          }
        });
      } catch (err) {
        console.error('Error fetching students:', err);
        setStudents([]);
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const toggleMode = () => setDarkMode(!darkMode);

  const handleFeedbackChange = (id, value) => {
    setFeedback(prev => ({ ...prev, [id]: value }));
  };

  const handleFeedbackSubmit = async (studentId) => {
    if (!feedback[studentId]) return;
    setSubmitted(prev => ({ ...prev, [studentId]: false }));
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ therapistId, studentId, message: feedback[studentId] })
      });
      const text = await res.text();
      try {
        JSON.parse(text);
      } catch (e) {
        console.error('Feedback POST did not return JSON:', text);
      }
      setSubmitted(prev => ({ ...prev, [studentId]: true }));
      setTimeout(() => setSubmitted(prev => ({ ...prev, [studentId]: false })), 2000);
      setFeedback(prev => ({ ...prev, [studentId]: '' }));
    } catch (err) {
      console.error('Error sending feedback:', err);
    }
  };

  return (
    <div className={`therapist-dashboard ${darkMode ? 'dark' : 'light'}`}>
      <header className="dashboard-header">
        <h1>Welcome, Therapist</h1>
        <div>
          <button onClick={toggleMode}>
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section className="assigned-children">
        <h2 style={{ textAlign: 'center', margin: '32px 0 24px', fontSize: '2rem', color: '#6a0dad' }}>Student Overview</h2>
        <div className="student-cards-container">
          {loading ? <div>Loading students...</div> : students.map((user) => {
            const prog = progress[user.id || user._id] || {};
            return (
              <div key={user.id || user._id} className="student-card">
                <div className="student-card-header">
                  <span className="student-avatar">👦</span>
                  <span className="student-name">{user.name}</span>
                </div>
                <div className="student-info">
                  <div><strong>Email:</strong> {user.email}</div>
                </div>
                <div className="student-progress">
                  {Object.keys(prog).length === 0 ? (
                    <div>No progress yet.</div>
                  ) : (
                    Object.keys(prog).map(subject => (
                      <div key={subject}>
                        <strong>{subject}:</strong> {prog[subject]?.length || 0} activities completed
                      </div>
                    ))
                  )}
                </div>
                <div className="feedback-section">
                  <textarea
                    placeholder="Add your feedback..."
                    value={feedback[user.id || user._id] || ''}
                    onChange={e => handleFeedbackChange(user.id || user._id, e.target.value)}
                    rows={2}
                    style={{ width: '100%', borderRadius: 8, padding: 6, marginTop: 10, resize: 'vertical' }}
                  />
                  <button
                    style={{ marginTop: 6, background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => handleFeedbackSubmit(user.id || user._id)}
                    disabled={!feedback[user.id || user._id]}
                  >
                    Send Feedback
                  </button>
                  {submitted[user.id || user._id] && <div style={{ color: '#4caf50', marginTop: 4, fontWeight: 600 }}>Feedback sent!</div>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TherapistDashboard;