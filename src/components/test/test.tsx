import { useState } from "react";
import "./test.less";

const questions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "Paris", isCorrect: true },
      { text: "London", isCorrect: false },
      { text: "Berlin", isCorrect: false },
      { text: "Madrid", isCorrect: false },
    ],
  },
];

export const Test: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showNext, setShowNext] = useState(false);

  const handleAnswerClick = (isCorrect: boolean) => {
    if (isCorrect) {
      console.log("Correct answer");
    } else {
      console.log("Incorrect answer");
    }
    setShowNext(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("End of the test");
    }
    setShowNext(false);
  };

  return (
    <div className="test-container">
      <div className="question">{questions[currentQuestionIndex].question}</div>
      <div className="answers">
        {questions[currentQuestionIndex].answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(answer.isCorrect)}
          >
            {answer.text}
          </button>
        ))}
      </div>
      {showNext && (
        <button className="next-button" onClick={handleNextQuestion}>
          Next
        </button>
      )}
    </div>
  );
};
