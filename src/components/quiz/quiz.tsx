import React, { useState, useEffect } from 'react';
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
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    if (selectedSkill) {
      // Always use lowercase for consistency
      dispatch(quizThunks.fetchQuizzes(selectedSkill.toLowerCase()));
    }
  }, [selectedSkill, dispatch]);

  const handleQuizClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowQuestions(true);
    setSelectedQuestion(null);
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
                quizzes.map((quiz: Quiz) => (
                  <div
                    key={quiz.id}
                    className={`quiz-title ${selectedQuiz?.id === quiz.id ? 'selected' : ''}`}
                    onClick={() => handleQuizClick(quiz)}
                  >
                    {quiz.title}
                  </div>
                ))
              ) : (
                <div className="no-quizzes">No quizzes available for this skill</div>
              )}
            </div>
            <div className="add-quiz-button-container">
              <div
                className="add-quiz-button"
                onClick={() => {
                  dispatch(quizThunks.createQuiz({ skill: selectedSkill.toLowerCase() }));
                }}
              >
                Add Quiz
              </div>
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
                onClick={() => {
                  if (selectedQuiz) {
                    dispatch(quizThunks.createQuestion({
                      quizId: selectedQuiz.id
                    }));
                  }
                }}
              >
                Add Question
              </div>
            </div>
          </>
        )}
      </div>

      <div className="quiz-content-right">
        {selectedQuestion && (
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
        )}
      </div>
    </div>
  );
};

export default Quiz;
