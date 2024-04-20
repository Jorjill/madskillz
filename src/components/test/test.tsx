import "./test.less";
import { useDispatch, useSelector } from "react-redux";
import { nextQuestion } from "../../slices/testSlice";
import { choosePage } from "../../slices/pageSlice";

export const Test: React.FC = () => {
  const dispatch = useDispatch();
  const { questions, currentQuestionIndex } = useSelector(
    (state: any) => state.test
  );
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (isCorrect: boolean) => {
    if (isCorrect) {
      console.log("Correct answer");
    } else {
      console.log("Incorrect answer");
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      dispatch(nextQuestion());
    } else {
      dispatch(choosePage("result"));
    }
  };

  return (
    <div className="test-container">
      <div className="question">{currentQuestion.question}</div>
      <div className="answers">
        {currentQuestion.answers.map((answer: any, index: any) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(answer.isCorrect)}
          >
            {answer.text}
          </button>
        ))}
      </div>
      {currentQuestionIndex < questions.length - 1 && (
        <button className="next-button" onClick={handleNextQuestion}>
          Next
        </button>
      )}
    </div>
  );
};
