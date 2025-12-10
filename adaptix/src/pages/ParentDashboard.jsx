import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [parent, setParent] = useState(null);
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState({});
  const [suggestion, setSuggestion] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  useEffect(() => {
    // Get parent info from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setParent(user);
    if (user?.id || user?._id) {
      // Fetch linked student using new backend route
      fetch(`${API_BASE_URL}/api/users/linked-student/${user.id || user._id}`)
        .then(async res => {
          if (!res.ok) {
            setStudent(null);
            setLoading(false);
            return;
          }
          const stu = await res.json();
          setStudent(stu);
          if (stu && (stu.id || stu._id)) {
            fetch(`${API_BASE_URL}/api/progress/${stu.id || stu._id}`)
              .then(res => res.json())
              .then(prog => setProgress(prog));
          }
          setLoading(false);
        })
        .catch(() => {
          setStudent(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleSend = async () => {
    if (!suggestion || !parent || !student) return;
    await fetch(`${API_BASE_URL}/api/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: parent.email,
        to: student.email,
        role: 'parent',
        message: suggestion
      })
    });
    setSent(true);
    setSuggestion('');
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Parent Dashboard</h2>
        <button 
          onClick={handleLogout}
          style={{
            background: '#ff4757',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#ff3742'}
          onMouseOut={(e) => e.target.style.background = '#ff4757'}
        >
          Logout
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : !student ? (
        <div>No student linked to your account.</div>
      ) : (
        <>
          <h3>Student: {student.name} ({student.email})</h3>
          <div style={{ margin: '18px 0', background: '#f9f9ff', borderRadius: 8, padding: 16 }}>
            <h4>Progress</h4>
            {Object.keys(progress).length === 0 ? (
              <div>No progress yet.</div>
            ) : (
              Object.keys(progress).map(subject => (
                <div key={subject} style={{ marginBottom: 8 }}>
                  <strong>{subject}:</strong> {progress[subject]?.length || 0} activities completed
                </div>
              ))
            )}
          </div>
          <div style={{ marginTop: 24 }}>
            <h4>Send a Suggestion</h4>
            <textarea
              value={suggestion}
              onChange={e => setSuggestion(e.target.value)}
              rows={3}
              style={{ width: '100%', borderRadius: 8, padding: 8, resize: 'vertical' }}
              placeholder="Write your suggestion here..."
            />
            <button
              style={{ marginTop: 8, background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 22px', cursor: 'pointer', fontWeight: 600 }}
              onClick={handleSend}
              disabled={!suggestion}
            >
              Send Suggestion
            </button>
            {sent && <div style={{ color: '#4caf50', marginTop: 6, fontWeight: 600 }}>Suggestion sent!</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default ParentDashboard;
