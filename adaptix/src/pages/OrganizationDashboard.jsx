import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const ROLES = [
  { key: 'student', label: 'Students' },
  { key: 'parent', label: 'Parents' },
  { key: 'therapist', label: 'Therapists' },
];

const OrganizationDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [users, setUsers] = useState({ student: [], parent: [], therapist: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalRole, setModalRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '', studentEmail: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // Fetch users by role
  const fetchUsers = async (role) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/users?role=${role}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => ({ ...prev, [role]: data }));
      } else {
        setError(data.message || data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ROLES.forEach((r) => fetchUsers(r.key));
    // eslint-disable-next-line
  }, []);

  const handleTab = (role) => {
    setActiveTab(role);
    setError('');
  };

  const handleDelete = async (id, role) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        fetchUsers(role);
      } else {
        setError(data.message || data.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (role) => {
    setModalRole(role);
    setForm({ name: '', email: '', password: '', studentEmail: '' });
    setShowModal(true);
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const body = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: modalRole,
      };
      if (modalRole === 'parent' && form.studentEmail) {
        body.studentEmail = form.studentEmail;
      }
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        fetchUsers(modalRole);
        closeModal();
      } else {
        setError(data.message || data.error || 'Failed to add user');
      }
    } catch (err) {
      setError('Failed to add user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 32, fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#4B2993', margin: 0 }}>Organization Dashboard</h1>
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
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {ROLES.map((r) => (
          <button
            key={r.key}
            onClick={() => handleTab(r.key)}
            style={{
              padding: '10px 28px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === r.key ? '#4B2993' : '#eaeaea',
              color: activeTab === r.key ? '#fff' : '#333',
              fontWeight: 600,
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: activeTab === r.key ? '0 2px 8px #4B299344' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: '#4B2993', margin: 0 }}>{ROLES.find(r => r.key === activeTab).label}</h2>
        <button
          onClick={() => openModal(activeTab)}
          style={{ background: '#4B2993', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
        >
          + Add New
        </button>
      </div>
      {error && <div style={{ color: '#d32f2f', marginBottom: 12, fontWeight: 600 }}>{error}</div>}
      {loading ? (
        <div style={{ padding: 32, textAlign: 'center', fontSize: 18 }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px #4B299322', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ background: '#f3eaff', color: '#4B2993', fontWeight: 700 }}>
                <th style={{ padding: '14px 10px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '14px 10px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '14px 10px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '14px 10px', textAlign: 'left' }}>Created At</th>
                <th style={{ padding: '14px 10px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users[activeTab].length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#888' }}>No users found.</td></tr>
              ) : (
                users[activeTab].map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 10px' }}>{user.name}</td>
                    <td style={{ padding: '12px 10px' }}>{user.email}</td>
                    <td style={{ padding: '12px 10px', textTransform: 'capitalize' }}>{user.role}</td>
                    <td style={{ padding: '12px 10px' }}>{new Date(user.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '12px 10px' }}>
                      {/* <button style={{ marginRight: 8, background: '#e0e0e0', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Edit</button> */}
                      <button
                        style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}
                        onClick={() => handleDelete(user._id, activeTab)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Add User Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, boxShadow: '0 4px 24px #4B299344', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ marginBottom: 18, color: '#4B2993' }}>Add New {ROLES.find(r => r.key === modalRole).label.slice(0, -1)}</h3>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Name</label>
                <input name="name" value={form.name} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleFormChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
              </div>
              {modalRole === 'parent' && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Student Email (to link)</label>
                  <input name="studentEmail" type="email" value={form.studentEmail} onChange={handleFormChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
                </div>
              )}
              <button type="submit" disabled={submitting} style={{ background: '#4B2993', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginTop: 8 }}>
                {submitting ? 'Adding...' : 'Add User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationDashboard;
