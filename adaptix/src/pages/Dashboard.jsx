import React from 'react';
import '../components/PlayfulTheme.css';

export default function Dashboard() {
  return (
    <div className="playful-bg playful-dashboard-container">
      <div className="floating-symbols dashboard-symbols">
        <span className="symbol">+</span>
        <span className="symbol">−</span>
        <span className="symbol">×</span>
        <span className="symbol">÷</span>
        <span className="symbol">A</span>
        <span className="symbol">B</span>
        <span className="symbol">C</span>
        <span className="symbol">?</span>
      </div>
      <div className="playful-card">
        <h1 className="playful-heading">Welcome to Adaptix Dashboard!</h1>
        <p className="playful-text">Explore fun activities and learning modules designed just for you!</p>
        <button className="playful-btn">Start Learning</button>
      </div>
    </div>
  );
}
