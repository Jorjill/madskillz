import React, { useState, useEffect, useRef } from 'react';
import './TypingPractice.less';

interface TypingPracticeProps {
  codeText: string;
  onComplete?: () => void;
}

const TypingPractice: React.FC<TypingPracticeProps> = ({ codeText, onComplete }) => {
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (userInput.length === codeText.length && userInput === codeText) {
      setIsComplete(true);
      setEndTime(Date.now());
      if (onComplete) {
        onComplete();
      }
    }
  }, [userInput, codeText, onComplete]);

  useEffect(() => {
    if (startTime && endTime) {
      const timeInMinutes = (endTime - startTime) / 60000;
      const wordsTyped = codeText.length / 5; // Standard: 5 characters = 1 word
      setWpm(Math.round(wordsTyped / timeInMinutes));
    }
  }, [startTime, endTime, codeText.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Don't allow typing beyond the current correct position
    if (value.length > currentIndex + 1) {
      return;
    }

    // Check if the new character is correct
    if (value.length > userInput.length) {
      const newChar = value[value.length - 1];
      const expectedChar = codeText[value.length - 1];
      
      if (newChar === expectedChar) {
        setCurrentIndex(value.length);
        setUserInput(value);
      } else {
        // Wrong character - don't update input, increment errors
        setErrors(prev => prev + 1);
        return;
      }
    } else {
      // Backspace - allow going back
      setUserInput(value);
      setCurrentIndex(value.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent certain keys that might break the typing flow
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
    }
  };

  const resetPractice = () => {
    setUserInput('');
    setCurrentIndex(0);
    setErrors(0);
    setIsComplete(false);
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderCodeWithCursor = () => {
    return codeText.split('').map((char, index) => {
      let className = 'char';
      
      if (index < userInput.length) {
        className += ' typed';
        if (userInput[index] === char) {
          className += ' correct';
        } else {
          className += ' incorrect';
        }
      } else if (index === currentIndex) {
        className += ' cursor';
      } else {
        className += ' untyped';
      }

      return (
        <span key={index} className={className}>
          {char === ' ' ? '\u00A0' : char}
          {char === '\n' ? <br /> : ''}
        </span>
      );
    });
  };

  const accuracy = userInput.length > 0 ? Math.round(((userInput.length - errors) / userInput.length) * 100) : 100;

  return (
    <div className="typing-practice-container">
      <div className="typing-practice-header">
        <h3>🚀 Code Typing Practice</h3>
        <p>Type the code below exactly as shown. The cursor will guide you!</p>
      </div>

      <div className="typing-stats">
        <div className="stat">
          <span className="stat-label">Progress:</span>
          <span className="stat-value">{currentIndex}/{codeText.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Errors:</span>
          <span className="stat-value error-count">{errors}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Accuracy:</span>
          <span className="stat-value">{accuracy}%</span>
        </div>
        {wpm > 0 && (
          <div className="stat">
            <span className="stat-label">WPM:</span>
            <span className="stat-value">{wpm}</span>
          </div>
        )}
      </div>

      <div className="typing-area">
        <div className="code-display">
          <pre className="code-text">
            {renderCodeWithCursor()}
          </pre>
        </div>

        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="typing-input"
          placeholder="Start typing the code above..."
          disabled={isComplete}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {isComplete && (
        <div className="completion-message">
          <h4>🎉 Congratulations!</h4>
          <p>You've successfully typed the entire code!</p>
          <div className="final-stats">
            <div>Final WPM: <strong>{wpm}</strong></div>
            <div>Accuracy: <strong>{accuracy}%</strong></div>
            <div>Total Errors: <strong>{errors}</strong></div>
          </div>
        </div>
      )}

      <div className="typing-actions">
        <button 
          className="reset-button" 
          onClick={resetPractice}
          disabled={userInput.length === 0 && !isComplete}
        >
          Reset Practice
        </button>
      </div>
    </div>
  );
};

export default TypingPractice;
