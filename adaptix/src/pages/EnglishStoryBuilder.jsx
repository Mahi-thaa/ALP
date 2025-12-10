import React, { useState, useEffect } from 'react';
import './EnglishStoryBuilder.css';
import FaceEmotionDetector from '../components/FaceEmotionDetector';
import { useProgress } from './ProgressContext';

function EnglishStoryBuilder() {
  const [character, setCharacter] = useState('');
  const [setting, setSetting] = useState('');
  const [action, setAction] = useState('');
  const [customLine, setCustomLine] = useState('');
  const [finalStory, setFinalStory] = useState('');
  const { refreshProgress } = useProgress();

  const handleBuildStory = () => {
    const baseStory = `Once upon a time, there was ${character} who lived in ${setting}. One day, ${character} decided to ${action}.`;
    const fullStory = customLine ? `${baseStory} ${customLine}` : baseStory;
    setFinalStory(fullStory);

    // ✅ Mark as completed when story is built
    markActivityComplete("English", "StoryBuilder");
  };

  const markActivityComplete = async (subject, activityName) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    let progressData = {};
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/progress/${userId}`);
      progressData = await res.json();
    } catch (e) {
      progressData = {};
    }
    if (!progressData[subject]) {
      progressData[subject] = [];
    }
    if (!progressData[subject].includes(activityName)) {
      progressData[subject].push(activityName);
      await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/progress/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: progressData })
      });
      refreshProgress();
    }
  };

  return (
    <div className="story-builder-container">
      <h1 className="story-builder-title">Story Builder</h1>

      <div className="dropdowns">
        <label>
          Choose a character:
          <select value={character} onChange={(e) => setCharacter(e.target.value)}>
            <option value="">--Select--</option>
            <option value="a brave girl">a brave girl</option>
            <option value="a curious boy">a curious boy</option>
            <option value="a clever dog">a clever dog</option>
            <option value="a talking cat">a talking cat</option>
          </select>
        </label>

        <label>
          Choose a setting:
          <select value={setting} onChange={(e) => setSetting(e.target.value)}>
            <option value="">--Select--</option>
            <option value="a magical forest">a magical forest</option>
            <option value="a quiet village">a quiet village</option>
            <option value="a school playground">a school playground</option>
            <option value="a snowy mountain">a snowy mountain</option>
          </select>
        </label>

        <label>
          Choose an action:
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="">--Select--</option>
            <option value="explore a secret cave">explore a secret cave</option>
            <option value="help a lost bird">help a lost bird</option>
            <option value="build a robot">build a robot</option>
            <option value="solve a mystery">solve a mystery</option>
          </select>
        </label>

        <label>
          Add your own creative line (optional):
          <textarea
            value={customLine}
            onChange={(e) => setCustomLine(e.target.value)}
            placeholder="And then something amazing happened..."
          />
        </label>
      </div>

      <button className="build-story-btn" onClick={handleBuildStory}>Build My Story</button>

      {finalStory && (
        <div className="final-story">
          <h3>Your Story:</h3>
          <p>{finalStory}</p>
        </div>
      )}

      <FaceEmotionDetector />
    </div>
  );
}

export default EnglishStoryBuilder;
