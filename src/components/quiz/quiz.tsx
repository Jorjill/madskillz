import React, { useState, useEffect, useRef } from 'react';
import './quiz.less';
import { useDispatch, useSelector } from 'react-redux';
import { quizThunks } from '../../slices/quizSlice';
import { AppDispatch, RootState } from '../../state/store';

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

const Quiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedSkill = useSelector((state: RootState) => state.skills.selectedSkill.title);
  const quizzes = useSelector((state: RootState) => state.quiz.quizzes);
  
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [editedAnswer, setEditedAnswer] = useState('');
  const [editedQuestion, setEditedQuestion] = useState('');
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [showNewQuizInput, setShowNewQuizInput] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionAnswer, setNewQuestionAnswer] = useState('');
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [editingQuizTitle, setEditingQuizTitle] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const newQuizRef = useRef<HTMLDivElement>(null);
  const editQuizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedSkill) {
      // Always use lowercase for consistency
      dispatch(quizThunks.fetchQuizzes(selectedSkill.toLowerCase()));
    }
  }, [selectedSkill, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (openMenuId) {
        const menuButton = document.querySelector(`[data-quiz-id="${openMenuId}"]`);
        const menuDropdown = menuButton?.nextElementSibling;
        
        if (!menuButton?.contains(target) && !menuDropdown?.contains(target)) {
          setOpenMenuId(null);
        }
      }
      if (newQuizRef.current && !newQuizRef.current.contains(target)) {
        setShowNewQuizInput(false);
        setNewQuizTitle('');
      }
      if (editingQuizId && editQuizRef.current && !editQuizRef.current.contains(target)) {
        setEditingQuizId(null);
        setEditingQuizTitle('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId, editingQuizId]);

  const handleMenuClick = (event: React.MouseEvent, quizId: string) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === quizId ? null : quizId);
  };

  const handleEditClick = (event: React.MouseEvent, quiz: Quiz) => {
    event.stopPropagation();
    setEditingQuizId(quiz.id);
    setEditingQuizTitle(quiz.title);
    setOpenMenuId(null);
  };

  const handleDeleteClick = (event: React.MouseEvent, quiz: Quiz) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      dispatch(quizThunks.deleteQuiz(quiz.id));
      if (selectedQuiz?.id === quiz.id) {
        setSelectedQuiz(null);
        setShowQuestions(false);
      }
    }
    setOpenMenuId(null);
  };

  const handleQuizSelect = (quiz: Quiz) => {
    if (editingQuizId === quiz.id) return;
    setSelectedQuiz(quiz);
    setShowQuestions(true);
    setSelectedQuestion(null);
    setShowNewQuizInput(false);
    setOpenMenuId(null);
  };

  const handleUpdateQuiz = () => {
    if (editingQuizId && editingQuizTitle.trim()) {
      dispatch(quizThunks.updateQuiz({ 
        quizId: editingQuizId, 
        title: editingQuizTitle.trim() 
      }));
      setEditingQuizId(null);
      setEditingQuizTitle('');
    }
  };

  const handleCancelEdit = () => {
    setEditingQuizId(null);
    setEditingQuizTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdateQuiz();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleAddQuiz = () => {
    setShowNewQuizInput(true);
    setNewQuizTitle('');
  };

  const handleAddQuestion = () => {
    setIsAddingQuestion(true);
    setSelectedQuestion(null);
    setNewQuestionTitle('');
    setNewQuestionText('');
    setNewQuestionAnswer('');
  };

  const handleCreateQuiz = () => {
    if (selectedSkill && newQuizTitle.trim()) {
      dispatch(quizThunks.createQuiz({ 
        skill: selectedSkill.toLowerCase(),
        title: newQuizTitle.trim()
      }));
      setShowNewQuizInput(false);
      setNewQuizTitle('');
    }
  };

  const handleCreateQuestion = () => {
    if (selectedQuiz && newQuestionText.trim()) {
      dispatch(quizThunks.createQuestion({ 
        quizId: selectedQuiz.id,
        title: newQuestionTitle.trim(),
        text: newQuestionText.trim(),
        answer: newQuestionAnswer.trim()
      }));
      setIsAddingQuestion(false);
      setNewQuestionTitle('');
      setNewQuestionText('');
      setNewQuestionAnswer('');
    }
  };

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
    setEditedAnswer(question.answer);
    setEditedQuestion(question.text);
  };

  const handleSaveAll = () => {
    if (selectedQuestion && selectedQuiz) {
      // Save both question and answer
      dispatch(quizThunks.updateQuestionAnswer({
        quizId: selectedQuiz.id,
        questionId: selectedQuestion.id,
        answer: editedAnswer
      }));
      const updatedQuestion = {
        ...selectedQuestion,
        text: editedQuestion
      };
      setSelectedQuestion(updatedQuestion);
    }
  };

  return (
    <div className="quiz-container">
      <div className="sidebar-container">
        {!showQuestions ? (
          // Show quiz list
          <>
            <div className="quiz-list">
              {quizzes && quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className={`quiz-title ${selectedQuiz?.id === quiz.id ? 'selected' : ''} ${editingQuizId === quiz.id ? 'editing' : ''}`}
                    onClick={() => handleQuizSelect(quiz)}
                  >
                    {editingQuizId === quiz.id ? (
                      <div className="edit-container" onClick={(e) => e.stopPropagation()}>
                        <input
                          className="edit-quiz-input"
                          value={editingQuizTitle}
                          onChange={(e) => setEditingQuizTitle(e.target.value)}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                        <div className="edit-actions">
                          <button 
                            className="save"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQuiz();
                            }}
                          >
                            Save
                          </button>
                          <button 
                            className="cancel"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelEdit();
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="quiz-text">{quiz.title}</span>
                        <button
                          className="menu-button"
                          onClick={(e) => handleMenuClick(e, quiz.id)}
                          data-quiz-id={quiz.id}
                        >
                          ⋮
                        </button>
                        {openMenuId === quiz.id && (
                          <div className="menu-dropdown">
                            <button
                              className="menu-item"
                              onClick={(e) => handleEditClick(e, quiz)}
                            >
                              Edit
                            </button>
                            <button
                              className="menu-item delete"
                              onClick={(e) => handleDeleteClick(e, quiz)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-quizzes">No quizzes available for this skill</div>
              )}
            </div>
            <div className="add-quiz-button-container" ref={newQuizRef}>
              {showNewQuizInput ? (
                <div className="new-quiz-input-container">
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
                    <button 
                      onClick={() => {
                        setShowNewQuizInput(false);
                        setNewQuizTitle('');
                      }} 
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="add-quiz-button"
                  onClick={handleAddQuiz}
                >
                  Add Quiz
                </div>
              )}
            </div>
          </>
        ) : (
          // Show questions list
          <>
            <div className="back-button" onClick={() => setShowQuestions(false)}>
              <i className="ri-arrow-left-line" /> Back to Quizzes
            </div>
            {selectedQuiz?.questions.map((question: Question) => (
              <div
                key={question.id}
                className={`question-title ${
                  selectedQuestion?.id === question.id ? 'selected' : ''
                }`}
                onClick={() => handleQuestionClick(question)}
              >
                {question.text}
              </div>
            ))}
            <div className="add-question-button-container">
              <div
                className="add-question-button"
                onClick={handleAddQuestion}
              >
                Add Question
              </div>
            </div>
          </>
        )}
      </div>

      <div className="quiz-content-right">
        {isAddingQuestion ? (
          <div className="quiz-content-container">
            <div className="question-container">
              <h2>New Question</h2>
              <div className="input-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  placeholder="Enter question title..."
                  className="question-input"
                />
              </div>
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
                  Add Question
                </button>
                <button className="cancel-button" onClick={() => setIsAddingQuestion(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : selectedQuestion ? (
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
              <button className="save-button" onClick={handleSaveAll}>
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="no-selection">
            Select a question to edit or add a new question
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
