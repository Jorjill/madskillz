import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { quizThunks } from '../../slices/quizSlice';
import { AppDispatch, RootState } from '../../state/store';
import './quiz.less';

// Types and Interfaces
interface Question {
  id: string;
  text: string;
  answer: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

// Dropdown Menu Component
const MenuDropdown: React.FC<{
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}> = ({ isOpen, anchorEl, onEdit, onDelete }) => {
  if (!isOpen || !anchorEl) return null;

  // Calculate position based on anchor element
  const rect = anchorEl.getBoundingClientRect();
  
  return ReactDOM.createPortal(
    <div 
      className="menu-dropdown"
      style={{
        position: 'fixed',
        top: rect.top,
        left: rect.right + 5,
      }}
    >
      <button onClick={onEdit}>Edit</button>
      <button className="delete" onClick={onDelete}>Delete</button>
    </div>,
    document.body
  );
};

// Quiz Component
const Quiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux State
  const selectedSkill = useSelector((state: RootState) => state.skills.selectedSkill.title);
  const quizzes = useSelector((state: RootState) => state.quiz.quizzes);
  
  // Quiz State Management
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [editingQuizTitle, setEditingQuizTitle] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  // New Quiz State
  const [showNewQuizInput, setShowNewQuizInput] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  
  // Question State Management
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedAnswer, setEditedAnswer] = useState('');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionAnswer, setNewQuestionAnswer] = useState('');
  const [openQuestionMenuId, setOpenQuestionMenuId] = useState<string | null>(null);
  const [questionMenuAnchorEl, setQuestionMenuAnchorEl] = useState<HTMLElement | null>(null);

  // Refs for DOM elements
  const newQuizRef = useRef<HTMLDivElement>(null);
  const editQuizRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    if (selectedSkill) {
      dispatch(quizThunks.fetchQuizzes(selectedSkill.toLowerCase()));
    }
  }, [selectedSkill, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (openMenuId || openQuestionMenuId) {
        const menuDropdowns = document.querySelectorAll('.menu-dropdown');
        const menuButtons = document.querySelectorAll('.menu-button');
        let clickedInside = false;

        menuDropdowns.forEach(dropdown => {
          if (dropdown.contains(target)) clickedInside = true;
        });
        menuButtons.forEach(button => {
          if (button.contains(target)) clickedInside = true;
        });

        if (!clickedInside) {
          setMenuAnchorEl(null);
          setOpenMenuId(null);
          setQuestionMenuAnchorEl(null);
          setOpenQuestionMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId, openQuestionMenuId]);

  // Quiz Menu Handlers
  const handleMenuClick = (event: React.MouseEvent, quizId: string) => {
    event.stopPropagation();
    if (openMenuId === quizId) {
      setMenuAnchorEl(null);
      setOpenMenuId(null);
    } else {
      setMenuAnchorEl(event.currentTarget as HTMLElement);
      setOpenMenuId(quizId);
    }
  };

  const handleQuestionMenuClick = (event: React.MouseEvent, questionId: string) => {
    event.stopPropagation();
    if (openQuestionMenuId === questionId) {
      setQuestionMenuAnchorEl(null);
      setOpenQuestionMenuId(null);
    } else {
      setQuestionMenuAnchorEl(event.currentTarget as HTMLElement);
      setOpenQuestionMenuId(questionId);
    }
  };

  // Quiz CRUD Operations
  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowQuestions(true);
    resetQuestionState();
  };

  const handleCreateQuiz = () => {
    if (selectedSkill && newQuizTitle.trim()) {
      dispatch(quizThunks.createQuiz({ 
        skill: selectedSkill.toLowerCase(),
        title: newQuizTitle.trim()
      }));
      resetNewQuizState();
    }
  };

  const handleUpdateQuiz = () => {
    if (editingQuizId && editingQuizTitle.trim()) {
      dispatch(quizThunks.updateQuiz({ 
        quizId: editingQuizId, 
        title: editingQuizTitle.trim() 
      }));
      resetEditQuizState();
    }
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setEditingQuizId(quiz.id);
    setEditingQuizTitle(quiz.title);
  };

  const handleDeleteQuiz = async (quiz: Quiz) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      await dispatch(quizThunks.deleteQuiz(quiz.id));
      if (selectedQuiz?.id === quiz.id) {
        resetQuizState();
      }
      closeMenus();
    }
  };

  // Question CRUD Operations
  const handleCreateQuestion = () => {
    if (selectedQuiz && newQuestionText.trim()) {
      dispatch(quizThunks.createQuestion({ 
        quizId: selectedQuiz.id,
        title: newQuestionTitle.trim(),
        text: newQuestionText.trim(),
        answer: newQuestionAnswer.trim()
      }));
      resetNewQuestionState();
    }
  };

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setEditedQuestion(question.text);
    setEditedAnswer(question.answer || '');
  };

  const handleUpdateQuestion = () => {
    if (selectedQuestion && selectedQuiz) {
      dispatch(quizThunks.updateQuestion({
        quizId: selectedQuiz.id,
        questionId: selectedQuestion.id,
        text: editedQuestion,
        answer: editedAnswer
      }));
      updateSelectedQuestion();
    }
  };

  const handleDeleteQuestion = async (question: Question) => {
    if (selectedQuiz && window.confirm('Are you sure you want to delete this question?')) {
      await dispatch(quizThunks.deleteQuestion({ 
        quizId: selectedQuiz.id, 
        questionId: question.id 
      }));
      if (selectedQuestion?.id === question.id) {
        resetQuestionState();
      }
      closeMenus();
    }
  };

  // State Reset Functions
  const resetQuizState = () => {
    setSelectedQuiz(null);
    setShowQuestions(false);
    resetQuestionState();
  };

  const resetEditQuizState = () => {
    setEditingQuizId(null);
    setEditingQuizTitle('');
  };

  const resetNewQuizState = () => {
    setShowNewQuizInput(false);
    setNewQuizTitle('');
  };

  const resetQuestionState = () => {
    setSelectedQuestion(null);
    setEditedQuestion('');
    setEditedAnswer('');
  };

  const resetNewQuestionState = () => {
    setIsAddingQuestion(false);
    setNewQuestionTitle('');
    setNewQuestionText('');
    setNewQuestionAnswer('');
  };

  // Utility Functions
  const closeMenus = () => {
    setMenuAnchorEl(null);
    setOpenMenuId(null);
    setQuestionMenuAnchorEl(null);
    setOpenQuestionMenuId(null);
  };

  const updateSelectedQuestion = () => {
    if (selectedQuestion) {
      const updatedQuestion = {
        ...selectedQuestion,
        text: editedQuestion,
        answer: editedAnswer
      };
      setSelectedQuestion(updatedQuestion);
    }
  };

  // Event Handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdateQuiz();
    } else if (e.key === 'Escape') {
      resetEditQuizState();
    }
  };

  // Render Methods
  const renderQuestions = () => {
    if (!selectedQuiz) return null;
    return (
      <div className="quiz-list">
        {selectedQuiz.questions.map((question) => (
          <div
            key={question.id}
            className={`quiz-title ${selectedQuestion?.id === question.id ? 'selected' : ''}`}
            onClick={() => handleEditQuestion(question)}
          >
            <span className="question-text">{question.text}</span>
            <div className="menu-button-container">
              <button
                className="menu-button"
                onClick={(e) => handleQuestionMenuClick(e, question.id)}
                data-question-id={question.id}
              >
                ⋮
              </button>
              <MenuDropdown
                isOpen={openQuestionMenuId === question.id}
                anchorEl={questionMenuAnchorEl}
                onEdit={() => handleEditQuestion(question)}
                onDelete={() => handleDeleteQuestion(question)}
              />
            </div>
          </div>
        ))}
        <div className="add-quiz-button" onClick={() => setIsAddingQuestion(true)}>
          + Add Question
        </div>
      </div>
    );
  };

  const renderQuizList = () => (
    <>
      <div className="quiz-list">
        {quizzes && quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`quiz-title ${selectedQuiz?.id === quiz.id ? 'selected' : ''}`}
            >
              {editingQuizId === quiz.id ? (
                <div className="edit-container" ref={editQuizRef}>
                  <input
                    type="text"
                    value={editingQuizTitle}
                    onChange={(e) => setEditingQuizTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="edit-quiz-input"
                  />
                  <div className="edit-actions">
                    <button className="save" onClick={handleUpdateQuiz}>
                      Save
                    </button>
                    <button className="cancel" onClick={resetEditQuizState}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span 
                    className="quiz-text"
                    onClick={() => handleQuizSelect(quiz)}
                  >
                    {quiz.title}
                  </span>
                  <div className="menu-button-container">
                    <button
                      className="menu-button"
                      onClick={(e) => handleMenuClick(e, quiz.id)}
                      data-quiz-id={quiz.id}
                    >
                      ⋮
                    </button>
                    <MenuDropdown
                      isOpen={openMenuId === quiz.id}
                      anchorEl={menuAnchorEl}
                      onEdit={() => handleEditQuiz(quiz)}
                      onDelete={() => handleDeleteQuiz(quiz)}
                    />
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="no-quizzes">No quizzes available for this skill</div>
        )}
      </div>
      {renderNewQuizInput()}
    </>
  );

  const renderNewQuizInput = () => (
    showNewQuizInput ? (
      <div className="new-quiz-input-container" ref={newQuizRef}>
        <input
          type="text"
          value={newQuizTitle}
          onChange={(e) => setNewQuizTitle(e.target.value)}
          placeholder="Enter quiz title..."
          className="new-quiz-input"
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleCreateQuiz();
            }
          }}
        />
        <div className="new-quiz-buttons">
          <button onClick={handleCreateQuiz} className="create-quiz-button">
            Create
          </button>
          <button onClick={resetNewQuizState} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <div className="add-quiz-button" onClick={() => setShowNewQuizInput(true)}>
        + Add Quiz
      </div>
    )
  );

  const renderQuestionContent = () => {
    if (isAddingQuestion) {
      return (
        <div className="quiz-content-container">
          <div className="question-container">
            <h2>New Question</h2>
            <div className="input-group">
              <label>Question:</label>
              <textarea
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Enter question text..."
                className="question-text"
              />
            </div>
            <div className="input-group">
              <label>Answer:</label>
              <textarea
                value={newQuestionAnswer}
                onChange={(e) => setNewQuestionAnswer(e.target.value)}
                placeholder="Enter answer..."
              />
            </div>
            <div className="button-group">
              <button className="save-button" onClick={handleCreateQuestion}>
                Create Question
              </button>
              <button className="cancel-button" onClick={resetNewQuestionState}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (selectedQuestion) {
      return (
        <div className="quiz-content-container">
          <div className="question-container">
            <h2>Question</h2>
            <textarea
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              placeholder="Enter your question..."
              className="question-text"
              style={{ minHeight: '100px' }}
            />
          </div>
          <div className="answer-container">
            <h2>Answer</h2>
            <textarea
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              placeholder="Enter your answer..."
            />
            <div className="button-group">
              <button className="save-button" onClick={handleUpdateQuestion}>
                Save Changes
              </button>
              <button 
                className="cancel-button" 
                onClick={() => {
                  setSelectedQuestion(null);
                  setEditedQuestion('');
                  setEditedAnswer('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="no-question-selected">
        <p>Select a question to view or edit</p>
      </div>
    );
  };

  // Main Render
  return (
    <div className="quiz-container">
      <div className="sidebar-container">
        {!showQuestions ? (
          renderQuizList()
        ) : (
          <>
            <div className="back-button" onClick={() => setShowQuestions(false)}>
              <i className="ri-arrow-left-line" /> Back to Quizzes
            </div>
            {renderQuestions()}
          </>
        )}
      </div>
      <div className="quiz-content-right">
        {renderQuestionContent()}
      </div>
    </div>
  );
};

export default Quiz;
