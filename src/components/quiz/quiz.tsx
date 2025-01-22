import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { quizThunks, quizActions } from "../../slices/quizSlice";
import { AppDispatch, RootState } from "../../state/store";
import "./quiz.less";
import Editor from "@monaco-editor/react";

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
        position: "fixed",
        top: rect.top,
        left: rect.right + 5,
      }}
    >
      <button onClick={onEdit}>Edit</button>
      <button className="delete" onClick={onDelete}>
        Delete
      </button>
    </div>,
    document.body
  );
};

// Quiz Component
const Quiz: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  // Redux State
  const selectedSkill = useSelector(
    (state: RootState) => state.skills.selectedSkill.title
  );
  const quizzes = useSelector((state: RootState) => state.quiz.quizzes);
  const selectedQuiz = useSelector(
    (state: RootState) => state.quiz.selectedQuiz
  );

  // Quiz State Management
  const [showQuestions, setShowQuestions] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [editingQuizTitle, setEditingQuizTitle] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(0);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [answerResults, setAnswerResults] = useState<Array<{ result: string; reason: string }>>([]);

  // New Quiz State
  const [showNewQuizInput, setShowNewQuizInput] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");

  // Question State Management
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionAnswer, setNewQuestionAnswer] = useState("");
  const [openQuestionMenuId, setOpenQuestionMenuId] = useState<string | null>(
    null
  );
  const [questionMenuAnchorEl, setQuestionMenuAnchorEl] =
    useState<HTMLElement | null>(null);
  const [isCodeMode, setIsCodeMode] = useState(false);

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
        const menuDropdowns = document.querySelectorAll(".menu-dropdown");
        const menuButtons = document.querySelectorAll(".menu-button");
        let clickedInside = false;

        menuDropdowns.forEach((dropdown) => {
          if (dropdown.contains(target)) clickedInside = true;
        });
        menuButtons.forEach((button) => {
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId, openQuestionMenuId]);

  useEffect(() => {
    if (selectedQuestion) {
      setEditedQuestion(selectedQuestion.text);
      setEditedAnswer(selectedQuestion.answer);
    }
  }, [selectedQuestion]);

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

  const handleQuestionMenuClick = (
    event: React.MouseEvent,
    questionId: string
  ) => {
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
    dispatch(quizActions.selectQuiz(quiz));
    setShowQuestions(true);
    setIsQuizStarted(false);
    setEditedQuestion("");
    setEditedAnswer("");
    setSelectedQuestion(null);
    setSelectedQuestionCount(quiz.questions ? quiz.questions.length : 0);
    setQuizQuestions([]);
  };

  const handleCreateQuiz = async () => {
    if (selectedSkill && newQuizTitle.trim()) {
      try {
        await dispatch(
          quizThunks.createQuiz({
            skill: selectedSkill,
            title: newQuizTitle.trim(),
            questions: [],
          })
        );

        resetNewQuizState();

        // Refresh the quiz list
        await dispatch(quizThunks.fetchQuizzes(selectedSkill.toLowerCase()));
      } catch (error) {
        console.error("Failed to create quiz:", error);
      }
    }
  };

  const handleUpdateQuiz = async () => {
    if (editingQuizId && editingQuizTitle.trim()) {
      try {
        await dispatch(
          quizThunks.updateQuiz(
            editingQuizId,
            { title: editingQuizTitle.trim() }
          )
        );
        resetEditQuizState();
        dispatch(quizThunks.fetchQuizzes(selectedSkill.toLowerCase()));
      } catch (error) {
        console.error("Failed to update quiz:", error);
      }
    }
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuizId(quiz.id);
    setEditingQuizTitle(quiz.title);
  };

  const handleDeleteQuiz = async (quiz: Quiz) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await dispatch(quizThunks.deleteQuiz(quiz.id, selectedSkill.toLowerCase()));
        if (selectedQuiz?.id === quiz.id) {
          resetQuizState();
        }
        closeMenus();
      } catch (error) {
        console.error("Failed to delete quiz:", error);
      }
    }
  };

  const handleStartQuiz = () => {
    if (selectedQuiz) {
      // Create a copy of the questions array and shuffle it
      const shuffledQuestions = [...selectedQuiz.questions].sort(() => Math.random() - 0.5);
      
      // Take only the number of questions selected by the user
      const selectedQuestions = shuffledQuestions.slice(0, selectedQuestionCount);
      
      setQuizQuestions(selectedQuestions);
      setIsQuizStarted(true);
      setCurrentQuestionIndex(0);
      setUserAnswer("");
      setShowAnswer(false);
      setIsQuizFinished(false);
      setUserAnswers([]);
      setAnswerResults([]);
    }
  };

  const handleQuestionCountChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const count = parseInt(e.target.value);
    setSelectedQuestionCount(count);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;

    try {
      const currentQuestion = quizQuestions[currentQuestionIndex];
      const result = await dispatch(quizThunks.submitAnswer({
        id: currentQuestion.id,
        question: currentQuestion.text,
        answer: currentQuestion.answer,
        providedAnswer: userAnswer.trim()
      }));

      const finalResult = result.payload || result;
      console.log('Answer Result:', finalResult); // Debug log

      // Store both the answer and its result
      setUserAnswers(prev => [...prev, userAnswer]);
      setAnswerResults(prev => [...prev, finalResult]);

    } catch (error) {
      console.error('Failed to submit answer:', error);
    }

    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setUserAnswer("");
      setShowAnswer(false);
    } else {
      setIsQuizFinished(true);
      const correctAnswers = answerResults.filter(result => 
        result && result.result && result.result.toUpperCase() === 'PASS'
      ).length;
      if(selectedQuiz) {
        dispatch(quizThunks.saveQuizResult({
          quiz_name: selectedQuiz.title,
          skill: selectedSkill,
          status: correctAnswers / answerResults.length >= 0.8 ? 'PASS' : 'FAIL',
          correct_answers: correctAnswers,
          total_questions: answerResults.length
        })).catch(error => {
          console.error('Failed to save quiz results:', error);
        });
      }
    }
  };

  const handleQuitQuiz = () => {
    setIsQuizStarted(false);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setShowAnswer(false);
    setIsQuizFinished(false);
    setUserAnswers([]);
    setAnswerResults([]);
  };

  const handleRestartQuiz = () => {
    handleStartQuiz();
  };

  // Question CRUD Operations
  const handleCreateQuestion = async () => {
    if (selectedQuiz && newQuestionText.trim()) {
      try {
        // Create the question
        await dispatch(
          quizThunks.createQuestion({
            quizId: selectedQuiz.id,
            text: newQuestionText.trim(),
            answer: newQuestionAnswer.trim(),
          })
        );
        resetNewQuestionState();
        await dispatch(quizThunks.fetchQuizzes(selectedSkill.toLowerCase()));
      } catch (error) {
        console.error("Failed to create question:", error);
      }
    }
  };

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setEditedQuestion(question.text);
    setEditedAnswer(question.answer || "");
  };

  const handleUpdateQuestion = async () => {
    if (selectedQuestion && selectedQuiz) {
      try {
        await dispatch(
          quizThunks.updateQuestion({
            quizId: selectedQuiz.id,
            questionId: selectedQuestion.id,
            text: editedQuestion,
            answer: editedAnswer,
          })
        );
        await dispatch(quizThunks.fetchQuizzes(selectedSkill.toLowerCase()));
      } catch (error) {
        console.error("Failed to update question:", error);
      }
    }
  };

  const handleDeleteQuestion = async (question: Question) => {
    if (
      selectedQuiz &&
      window.confirm("Are you sure you want to delete this question?")
    ) {
      try {
        await dispatch(
          quizThunks.deleteQuestion({
            quizId: selectedQuiz.id,
            questionId: question.id,
          })
        );
        if (selectedQuestion?.id === question.id) {
          resetQuestionState();
        }
        closeMenus();
        dispatch(quizThunks.fetchQuizzes(selectedSkill.toLowerCase()));
      } catch (error) {
        console.error("Failed to delete question:", error);
      }
    }
  };

  // State Reset Functions
  const resetQuizState = () => {
    setShowQuestions(false);
    resetQuestionState();
  };

  const resetEditQuizState = () => {
    setEditingQuizId(null);
    setEditingQuizTitle("");
  };

  const resetNewQuizState = () => {
    setShowNewQuizInput(false);
    setNewQuizTitle("");
  };

  const resetQuestionState = () => {
    setSelectedQuestion(null);
    setEditedQuestion("");
    setEditedAnswer("");
  };

  const resetNewQuestionState = () => {
    setIsAddingQuestion(false);
    setNewQuestionText("");
    setNewQuestionAnswer("");
  };

  // Utility Functions
  const closeMenus = () => {
    setMenuAnchorEl(null);
    setOpenMenuId(null);
    setQuestionMenuAnchorEl(null);
    setOpenQuestionMenuId(null);
  };

  // Event Handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateQuiz();
    } else if (e.key === "Escape") {
      resetEditQuizState();
    }
  };

  // Render Methods
  const renderQuestions = () => {
    if (!selectedQuiz) return null;
    return (
      <div className="quiz-list">
        {selectedQuiz.questions &&
          selectedQuiz.questions.map((question) => (
            <div
              key={question.id}
              className={`quiz-title ${
                selectedQuestion?.id === question.id ? "selected" : ""
              }`}
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
        <div
          className="add-quiz-button"
          onClick={() => {
            setIsAddingQuestion(true);
            setSelectedQuestion(null);
            setEditedQuestion("");
            setEditedAnswer("");
          }}
        >
          + Add question
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
              className={`quiz-title ${
                selectedQuiz?.id === quiz.id ? "selected" : ""
              }`}
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

  const renderNewQuizInput = () =>
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
            if (e.key === "Enter") {
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
      <div
        className="add-quiz-button"
        onClick={() => setShowNewQuizInput(true)}
      >
        + Add Quiz
      </div>
    );

  const renderQuestionContent = () => {
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
            />
          </div>
          <div className="answer-container">
            <h2>Answer</h2>
            <div className="mode-switch">
              <label>
                <input
                  type="checkbox"
                  checked={isCodeMode}
                  onChange={(e) => setIsCodeMode(e.target.checked)}
                />
                Code Mode
              </label>
            </div>
            {isCodeMode ? (
              <Editor
                height="200px"
                defaultLanguage="javascript"
                value={editedAnswer}
                onChange={(value) => setEditedAnswer(value || '')}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                }}
              />
            ) : (
              <textarea
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                placeholder="Enter your answer..."
              />
            )}
            <div className="button-group">
              <button className="save-button" onClick={handleUpdateQuestion}>
                Save Changes
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setSelectedQuestion(null);
                  setEditedQuestion("");
                  setEditedAnswer("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }
    if (isAddingQuestion) {
      return (
        <div className="quiz-content-container">
          <div className="question-container">
            <h2>Question</h2>
            <textarea
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Enter your question..."
              className="question-text"
            />
          </div>
          <div className="answer-container">
            <h2>Answer</h2>
            <div className="mode-switch">
              <label>
                <input
                  type="checkbox"
                  checked={isCodeMode}
                  onChange={(e) => setIsCodeMode(e.target.checked)}
                />
                Code Mode
              </label>
            </div>
            {isCodeMode ? (
              <Editor
                height="200px"
                defaultLanguage="javascript"
                value={newQuestionAnswer}
                onChange={(value) => setNewQuestionAnswer(value || '')}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                }}
              />
            ) : (
              <textarea
                value={newQuestionAnswer}
                onChange={(e) => setNewQuestionAnswer(e.target.value)}
                placeholder="Enter your answer..."
              />
            )}
            <div className="button-group">
              <button className="save-button" onClick={handleCreateQuestion}>
                Save Changes
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setIsAddingQuestion(false);
                  resetNewQuestionState();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!selectedQuiz) {
      return (
        <div className="no-question-selected">
          Select a quiz to view questions
        </div>
      );
    }

    if (!isQuizStarted) {
      const maxQuestions =
        selectedQuiz.questions && selectedQuiz.questions.length;
      const questionOptions = Array.from(
        { length: maxQuestions },
        (_, i) => i + 1
      );

      return (
        <div className="quiz-content-container">
          <div className="quiz-start-container">
            <h2>{selectedQuiz.title}</h2>
            <p className="quiz-info">
              This quiz contains {maxQuestions} question
              {maxQuestions !== 1 ? "s" : ""}.
            </p>
            <div className="question-count-selector">
              <label htmlFor="questionCount">Number of questions:</label>
              <select
                id="questionCount"
                value={selectedQuestionCount}
                onChange={handleQuestionCountChange}
                className="question-count-select"
              >
                {questionOptions.map((num) => (
                  <option key={num} value={num}>
                    {num} question{num !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="start-quiz-button"
              onClick={handleStartQuiz}
              disabled={selectedQuestionCount === 0}
            >
              Start Quiz
            </button>
          </div>
        </div>
      );
    }

    if (isQuizFinished) {
      // Calculate percentage of correct answers
      console.log('All Results:', answerResults); // Debug log
      
      const correctAnswers = answerResults.filter(result => {
        console.log('Checking result:', result); // Debug log
        return result && result.result && result.result.toUpperCase() === 'PASS';
      }).length;
      
      const totalQuestions = answerResults.length;
      const correctPercentage = totalQuestions > 0 
        ? (correctAnswers / totalQuestions) * 100 
        : 0;

      console.log(`Correct: ${correctAnswers}, Total: ${totalQuestions}, Percentage: ${correctPercentage}%`); // Debug log

      const isPassed = correctPercentage >= 80;
      
      return (
        <div className="quiz-results-container">
          <h2>Quiz Results</h2>
          <div className="quiz-summary">
            <p>You've completed {selectedQuiz.title}!</p>
            <p>Total Questions: {quizQuestions.length}</p>
            <div className="result-status">
              <p>Correct Answers: {correctAnswers} out of {totalQuestions} ({correctPercentage.toFixed(1)}%)</p>
              <p className={`status ${isPassed ? 'pass' : 'fail'}`}>
                Status: {isPassed ? 'PASS' : 'FAIL'}
              </p>
            </div>
          </div>

          <div className="answers-review">
            {quizQuestions.map((question, index) => {
              const apiResult = answerResults[index];
              return (
                <div key={question.id} className="answer-review-item">
                  <div className="question">
                    <span className="question-number">Question {index + 1}</span>
                    <p>{question.text}</p>
                  </div>
                  <div className="answers">
                    <div className="user-answer">
                      <h4>Your Answer:</h4>
                      <p>{userAnswers[index]}</p>
                      {apiResult && (
                        <div className={`api-result ${apiResult.result.toLowerCase()}`}>
                          <span className="result">{apiResult.result}</span>
                          <p className="reason">{apiResult.reason}</p>
                        </div>
                      )}
                    </div>
                    <div className="correct-answer">
                      <h4>Correct Answer:</h4>
                      <p>{question.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="results-actions">
            <button className="restart-button" onClick={handleRestartQuiz}>
              Restart Quiz
            </button>
            <button className="quit-button" onClick={handleQuitQuiz}>
              Exit to Quiz Selection
            </button>
          </div>
        </div>
      );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    return (
      <div className="quiz-active-container">
        <div className="quiz-header">
          <h2>
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </h2>
          <button className="quit-button" onClick={handleQuitQuiz}>
            Quit Quiz
          </button>
        </div>

        <div className="question-display">
          <div className="question-text">{currentQuestion.text}</div>
        </div>

        <div className="answer-input-container">
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            disabled={showAnswer}
          />
          {showAnswer ? (
            <>
              <div className="correct-answer">
                <h3>Correct Answer:</h3>
                <p>{currentQuestion.answer}</p>
              </div>
              <button className="next-button" onClick={handleNextQuestion}>
                {currentQuestionIndex === quizQuestions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </button>
            </>
          ) : (
            <button
              className="submit-button"
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim()}
            >
              Submit Answer
            </button>
          )}
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
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
            <div
              className="back-button"
              onClick={() => setShowQuestions(false)}
            >
              <i className="ri-arrow-left-line" /> Back to Quizzes
            </div>
            {renderQuestions()}
          </>
        )}
      </div>
      <div className="quiz-content-right">{renderQuestionContent()}</div>
    </div>
  );
};

export default Quiz;
