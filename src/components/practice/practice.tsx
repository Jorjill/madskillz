import { useEffect, useMemo, useRef, useState } from "react";
import "./practice.less";
import Quill from "quill";
import { useDispatch, useSelector } from "react-redux";
import {
  practiceThunks,
  selectRandomGeneralQuestionBySkill,
  selectRandomPastQuestion,
  selectRandomSpecificQuestion,
} from "../../slices/practiceSlice";
import axios from "axios";
import { GeneralAnswerModal } from "../general-answer-modal/general-answer-modal";

export const Practice: React.FC = () => {
  const dispatch = useDispatch();
  const quillRef = useRef<Quill | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const selectedSkillTitle = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const practiceMode = useSelector((state: any) => state.practice.practiceMode);
  const generalQuestions = useSelector(
    (state: any) => state.practice.generalQuestions
  );
  const [gptResponse, setGptResponse] = useState({ result: "", reason: "" });
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [randomGeneralQuestion, setRandomGeneralQuestion] = useState(null);
  const randomSpecificQuestion = useSelector(selectRandomSpecificQuestion);
  const randomPastQuestion = useSelector(selectRandomPastQuestion);
  
  useEffect(() => {
    dispatch<any>(practiceThunks.fetchGeneralQuestions());
    if (quillRef.current === null) {
      // Only instantiate Quill if quillRef.current is null
      quillRef.current = new Quill("#editor", {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image", "code-block"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        if (quillRef.current) {
          // Check for null before accessing quillRef.current
          const plainText = quillRef.current
            .getText()
            .replace(/<\/?[^>]+(>|$)/g, "")
            .trim();
          setAnswerContent(plainText);
        }
      });
    }
  }, []);

  useMemo(() => {
    setRandomGeneralQuestion(
      selectRandomGeneralQuestionBySkill(generalQuestions, selectedSkillTitle)
    );
  }, [generalQuestions, selectedSkillTitle]);

  const handleNextButton = () => {
    if (gptResponse.result === "PASS") {
      const randomQuestion = selectRandomGeneralQuestionBySkill(
        generalQuestions,
        selectedSkillTitle
      );
      quillRef.current?.setText("");
      setAnswerContent("");
      setRandomGeneralQuestion(randomQuestion);
    }
    setShowResponseModal(false);
  };

  const submitAnswer = async () => {
    const res = await axios.post(
      "http://localhost:3000/general-question/answer",
      {
        question: randomGeneralQuestion?.question,
        answer: randomGeneralQuestion?.answer,
        providedAnswer: answerContent,
      }
    );
    setGptResponse(res.data);
    setShowResponseModal(true);
  };

  return (
    <div className="practice-container">
      <div className="practice">
        {practiceMode === "general" ? (
          <h1>{randomGeneralQuestion?.question}</h1>
        ) : practiceMode === "specific" ? (
          <h1>{randomSpecificQuestion}</h1>
        ) : practiceMode === "past" ? (
          <h1>{randomPastQuestion}</h1>
        ) : (
          <div></div>
        )}
        <div id="editor" style={{ height: "500px" }}></div>{" "}
        <div
          className="submit-button"
          onClick={() => {
            submitAnswer();
          }}
        >
          Submit
        </div>
      </div>
      {showResponseModal && (
        <GeneralAnswerModal
          onClose={handleNextButton}
          gptResponse={gptResponse}
        />
      )}
    </div>
  );
};
