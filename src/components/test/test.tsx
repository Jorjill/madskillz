import "./test.less";
import { useDispatch, useSelector } from "react-redux";
import { nextQuestion, selectQuestionsBySkill } from "../../slices/testSlice";
import { choosePage } from "../../slices/pageSlice";

export const Test: React.FC = () => {
  const dispatch = useDispatch();
  const { currentQuestionIndex } = useSelector((state: any) => state.test);
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );

  const questions = useSelector((state: any) =>
    selectQuestionsBySkill(state, selectedSkill)
  );

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (isCorrect: boolean) => {
    if (isCorrect) {
      handleNextQuestion();
    }
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
      <div className="answers-container">
        <div className="answer">
          {" "}
          {currentQuestion.answers.map((answer: any, index: any) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(answer.isCorrect)}
            >
              {answer.text}
            </button>
          ))}
        </div>
      </div>
      {currentQuestionIndex < questions.length - 1 && (
        <button className="next-button" onClick={handleNextQuestion}>
          Next
        </button>
      )}
    </div>
  );
};
