import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // Determine dashboard path based on user role
  let dashboardPath = '/dashboard/student';
  if (user) {
    switch (user.role) {
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
  }

  // Check if user role should hide dashboard link
  const shouldHideDashboard = user && ['parent', 'therapist', 'organization'].includes(user.role);

  return (
    <nav className="navbar playful-navbar">
      <div className="floating-symbols">
        <span className="symbol">+</span>
        <span className="symbol">−</span>
        <span className="symbol">×</span>
        <span className="symbol">÷</span>
        <span className="symbol">A</span>
        <span className="symbol">B</span>
        <span className="symbol">C</span>
        <span className="symbol">?</span>
      </div>
      <div className="navbar-logo playful-logo" onClick={() => navigate('/')}>ADAPTIX</div>
      <div className="navbar-links playful-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>Home</NavLink>
        <NavLink to="/activities" className={({ isActive }) => isActive ? 'active' : ''}>Activities</NavLink>
        <NavLink to="/learning-modules" className={({ isActive }) => isActive ? 'active' : ''}>Learning Modules</NavLink>
        {!shouldHideDashboard && (
          <NavLink to={dashboardPath} className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        )}
        {shouldHideDashboard && (
          <button 
            onClick={handleLogout}
            className="logout-button"
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
        )}
      </div>
    </nav>
  );
};

export default Navbar; 