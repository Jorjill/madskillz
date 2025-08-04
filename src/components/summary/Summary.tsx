import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { apiClient } from '../../utils/apiClient';
import { summaryEvents } from '../../utils/summaryEvents';
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
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const selectedSkill = useSelector((state: any) => state.skills.selectedSkill);

  const fetchSummary = async (isRetry = false) => {
    if (!selectedSkill?.title) {
      setError('No skill selected');
      return;
    }

    setLoading(true);
    setError(null);
    
    if (!isRetry) {
      setRetryCount(0);
      setIsGenerating(true);
    }

    try {
      // Create a timeout promise for long-running requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - Summary generation is taking longer than expected')), 120000); // 2 minutes
      });

      const fetchPromise = apiClient.get(`/notes/summary/${selectedSkill.title}`);
      
      const response = await Promise.race([fetchPromise, timeoutPromise]) as any;
      setSummaryData(response.data);
      setIsGenerating(false);
    } catch (err) {
      console.error('Error fetching summary:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch summary';
      
      // Check if it's a timeout or network error that might benefit from retry
      const isRetryableError = errorMessage.includes('timeout') || 
                              errorMessage.includes('network') || 
                              errorMessage.includes('fetch') ||
                              errorMessage.includes('500') ||
                              errorMessage.includes('502') ||
                              errorMessage.includes('503') ||
                              errorMessage.includes('504');
      
      if (isRetryableError && retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setError(`Attempt ${retryCount + 1} failed. Retrying... (${errorMessage})`);
        
        // Retry with exponential backoff
        setTimeout(() => {
          fetchSummary(true);
        }, Math.pow(2, retryCount) * 1000); // 1s, 2s, 4s delays
        
        return;
      }
      
      setError(errorMessage);
      setIsGenerating(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchSummary();
  };

  useEffect(() => {
    fetchSummary();
  }, [selectedSkill?.title]);

  // Listen for summary refresh events (e.g., when notes are deleted)
  useEffect(() => {
    console.log('Summary component: Setting up event listener');
    const unsubscribe = summaryEvents.subscribe(() => {
      console.log('Summary component: Received summary refresh event - calling fetchSummary()');
      fetchSummary();
    });

    return () => {
      console.log('Summary component: Cleaning up event listener');
      unsubscribe();
    };
  }, []);



  if (loading) {
    const loadingMessage = isGenerating 
      ? `Generating summary for ${selectedSkill?.title}... This may take up to 2 minutes for first-time generation.`
      : retryCount > 0 
        ? `Retrying... (Attempt ${retryCount + 1}/4)`
        : 'Loading summary...';
        
    return (
      <div className="summary-container">
        <div className="summary-header">
          <h2>Summary for {selectedSkill?.title}</h2>
        </div>
        <div className="loading-message">
          <p>{loadingMessage}</p>
          {isGenerating && (
            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '1rem' }}>
              💡 First-time summary generation uses AI and takes longer. Subsequent loads will be much faster.
            </p>
          )}
        </div>
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
          <button onClick={handleRetry}>Load Summary</button>
        </div>
      )}
    </div>
  );
};

export default Summary;
