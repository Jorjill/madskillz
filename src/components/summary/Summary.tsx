import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../AuthProvider';
import './Summary.less';

interface SummaryData {
  summary: string;
  keyPoints: string[];
  totalNotes: number;
  lastUpdated: string;
}

export const Summary: React.FC = () => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const selectedSkill = useSelector((state: any) => state.skills.selectedSkill);
  const { user } = useAuth();

  const fetchSummary = async () => {
    if (!user || !selectedSkill?.title) {
      setError('User not authenticated or no skill selected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      const response = await fetch(`http://localhost:3000/notes/summary/${selectedSkill.title}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSummaryData(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [selectedSkill?.title, user]);

  if (loading) {
    return (
      <div className="summary-container">
        <div className="summary-header">
          <h2>Summary for {selectedSkill?.title}</h2>
        </div>
        <div className="loading-message">Loading summary...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="summary-container">
        <div className="summary-header">
          <h2>Summary for {selectedSkill?.title}</h2>
        </div>
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-container">
      <div className="summary-header">
        <h2>Summary for {selectedSkill?.title}</h2>
      </div>

      {summaryData ? (
        <div className="summary-content">
          {summaryData.lastUpdated && (
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Last Updated:</span>
                <span className="stat-value">
                  {new Date(summaryData.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {summaryData.summary && (
            <div className="summary-section">
              <h3>Summary</h3>
              <p className="summary-text">{summaryData.summary}</p>
            </div>
          )}

          {summaryData.keyPoints && summaryData.keyPoints.length > 0 && (
            <div className="summary-section">
              <h3>Key Points</h3>
              <ul className="key-points-list">
                {summaryData.keyPoints.map((point, index) => (
                  <li key={index} className="key-point">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="no-data-message">
          <p>No summary data available for {selectedSkill?.title}</p>
          <button onClick={fetchSummary}>Load Summary</button>
        </div>
      )}
    </div>
  );
};

export default Summary;
