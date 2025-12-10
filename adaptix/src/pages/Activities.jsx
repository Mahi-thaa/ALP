// Activities.jsx
import React, { useState } from 'react';
import './Activities.css';
import { useNavigate } from 'react-router-dom';
import FaceEmotionDetector from '../components/FaceEmotionDetector';

const subjects = [
  { name: 'English', icon: '📘' },
  { name: 'Math', icon: '🔢' },
  { name: 'Logical Reasoning', icon: '🧠' },
];

const activitiesData = {
  English: [
    { title: 'MCQ Quiz', route: '/activities/english/mcq' },
    { title: 'Word Match Game', route: '/activities/english/word-match' },
    { title: 'Story Builder', route: '/activities/english/story-builder' }
  ],
  Math: [
    { title: 'MCQ Quiz', route: '/activities/math/mcq' },
    { title: 'Number Puzzle', route: '/activities/math/number-puzzle' },
    { title: 'Math Maze', route: '/activities/math/maze' }
  ],
  'Logical Reasoning': [
    { title: 'MCQ Quiz', route: '/activities/logical/mcq' },
    { title: 'Shape Matcher', route: '/activities/logical/shape-match' },
    { title: 'Sequence Game', route: '/activities/logical/sequence-game' }
  ]
};

function Activities() {
  const [activeSubject, setActiveSubject] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      <FaceEmotionDetector />
      <div className="activities-container">
        <h1 className="activities-title">Activities</h1>
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className={`subject-card ${activeSubject === subject.name ? 'active' : ''}`}
              onClick={() => setActiveSubject(subject.name)}
            >
              <span className="icon">{subject.icon}</span>
              <span>{subject.name}</span>
            </div>
          ))}
        </div>

        {activeSubject && (
          <div className="subject-activities">
            <h2>{activeSubject} Activities</h2>
            <div className="activities-list">
              {activitiesData[activeSubject].map((activity, index) => (
                <div
                  key={index}
                  className="activity-card"
                  onClick={() => navigate(activity.route)}
                >
                  {activity.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export { activitiesData };
export default Activities;
