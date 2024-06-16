import { useDispatch, useSelector } from "react-redux";
import "./add-question.less";
import { useState } from "react";
import { practiceThunks } from "../../slices/practiceSlice";

interface AddQuestionProps {
  onClose: () => void;
  practiceMode: string;
}

export const AddQuestion: React.FC<AddQuestionProps> = ({
  onClose,
  practiceMode,
}) => {
  const dispatch = useDispatch();
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );

  const [questionContent, setQuestionContent] = useState("");
  const [answer, setAnswer] = useState("");

  return (
    <div className="add-question-component">
      <div className="add-question">
        <input type="text" placeholder="Question title" name="" id="" />
        <p>Question:</p>
        <textarea
          onChange={(e) => {
            setQuestionContent(e.target.value);
          }}
          className="question-input"
        />
        <p>Answer:</p>
        <textarea
          onChange={(e) => {
            setAnswer(e.target.value);
          }}
          className="answer-input"
        />

        <div className="button-and-tag">
          <div className="back-button" onClick={onClose}>
            Back
          </div>
          <div
            className="create-question-button"
            onClick={() => {
              if (practiceMode === "specific") {
                dispatch<any>(
                  practiceThunks.createSpecificQuestion(
                    questionContent,
                    answer,
                    selectedSkill
                  )
                );
              } else {
                dispatch<any>(
                  practiceThunks.createGeneralQuestion(
                    questionContent,
                    answer,
                    selectedSkill
                  )
                );
              }
              onClose();
            }}
          >
            Create question
          </div>
        </div>
      </div>
    </div>
  );
};
