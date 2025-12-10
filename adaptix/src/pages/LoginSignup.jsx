import React, { useState } from 'react';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [signupError, setSignupError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(null);
  const [role, setRole] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccess(null);
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;
    const role = e.target.role.value;
    const studentEmail = e.target.studentEmail ? e.target.studentEmail.value : '';

    if (password !== confirm) {
      setSignupError("Passwords don't match!");
      return;
    }
    if (!name) {
      setSignupError("Name is required");
      return;
    }
    try {
      const body = { name, email, password, role };
      if (role === 'parent') body.studentEmail = studentEmail;
      const res = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        setSignupSuccess('Signup successful! You can now log in.');
        setIsLogin(true);
      } else {
        setSignupError(data.message || data.error || 'Signup failed');
      }
    } catch (err) {
      setSignupError('Signup failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        // Store user and token in localStorage
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id); // or data.user._id if that's the field

        let dashboardPath = '/dashboard/student'; // default
        switch (data.user.role) {
          case 'parent':
            dashboardPath = '/dashboard/parent';
            break;
          case 'therapist':
            dashboardPath = '/dashboard/therapist';
            break;
          case 'organization':
            dashboardPath = '/dashboard/organization';
            break;
          default:
            dashboardPath = '/dashboard/student';
        }

        alert('Login successful!');
        navigate(dashboardPath);
      } else {
        alert(data.message || data.error || 'Invalid credentials');
      }
    } catch (err) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="cloud"></div>
      <div className="card">
        <h1 className="title">ADAPTIX</h1>
        <div className="toggle-buttons">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <input type="password" name="confirm" placeholder="Confirm Password" required />
            <select name="role" required value={role} onChange={e => setRole(e.target.value)}>
              <option value="">Choose Role</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="therapist">Therapist</option>
              <option value="organization">Educational Organization</option>
            </select>
            {role === 'parent' && (
              <input type="email" name="studentEmail" placeholder="Enter your child's email ID" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} required />
            )}
            <button type="submit">Sign Up</button>
            {signupError && <div className="message error">{signupError}</div>}
            {signupSuccess && <div className="message success">{signupSuccess}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginSignup;
