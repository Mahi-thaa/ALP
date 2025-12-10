import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchProgress = useCallback(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/progress/${userId}`)
      .then(res => res.json())
      .then(data => setProgress(data || {}))
      .finally(() => setLoading(false));
  }, []);

  // Call this after activity completion
  const refreshProgress = () => {
    fetchProgress();
  };

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return (
    <ProgressContext.Provider value={{ progress, refreshProgress, loading, fetchProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
} 