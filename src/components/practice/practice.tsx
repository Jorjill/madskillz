import { useEffect, useMemo, useRef, useState } from "react";
import "./practice.less";
import Quill from "quill";
import { useDispatch, useSelector } from "react-redux";
import {
  practiceThunks,
  selectRandomPastQuestion,
  selectRandomQuestionBySkill,
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
  const specificQuestions = useSelector(
    (state: any) => state.practice.specificQuestions
  );
  const pastQuestions = useSelector(
    (state: any) => state.practice.pastQuestions
  );
  const [gptResponse, setGptResponse] = useState({ result: "", reason: "" });
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [randomQuestion, setRandomQuestion] = useState(null);

  useEffect(() => {
    dispatch<any>(practiceThunks.fetchQuestions());
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

  const selectNewRandomQuestion = () => {
    if (practiceMode === "general") {
      setRandomQuestion(
        selectRandomQuestionBySkill(generalQuestions, selectedSkillTitle)
      );
    } else if (practiceMode === "specific") {
      setRandomQuestion(
        selectRandomQuestionBySkill(specificQuestions, selectedSkillTitle)
      );
    } else if (practiceMode === "past") {
      setRandomQuestion(
        selectRandomQuestionBySkill(pastQuestions, selectedSkillTitle)
      );
    }
  };

  useEffect(() => {
    selectNewRandomQuestion();
  }, [practiceMode]);

  useMemo(() => {
    selectNewRandomQuestion();
  }, [generalQuestions, selectedSkillTitle]);

  const handleSkipButton = () => {
    selectNewRandomQuestion();
    quillRef.current?.setText("");
    setAnswerContent("");
  };

  const handleNextButton = () => {
    if (gptResponse.result === "PASS") {
      selectNewRandomQuestion();
      quillRef.current?.setText("");
      setAnswerContent("");
    }
    setShowResponseModal(false);
  };

  const handleCloseButton = () => {
    setShowResponseModal(false);
  };

  const submitAnswer = async () => {
    const res = await axios.post(
      "http://localhost:3000/general-question/answer",
      {
        question: randomQuestion?.question,
        answer: randomQuestion?.answer,
        providedAnswer: answerContent,
      }
    );
    setGptResponse(res.data);
    setShowResponseModal(true);
  };

  const handleDeleteGeneralQuestion = () => {
    dispatch<any>(practiceThunks.deleteGeneralQuestion(randomQuestion));
  };

  return (
    <div className="practice-container">
      <div className="practice-question">
        <h1>{randomQuestion?.question}</h1>{" "}
        <i
          className="ri-delete-bin-7-line"
          onClick={() => {
            handleDeleteGeneralQuestion();
          }}
        ></i>
      </div>
      <div className="practice">
        <div className="editor-and-buttons">
          <div id="editor" style={{ height: "500px" }}></div>
          <div className="skip-submit-buttons">
            <div
              className="skip-button"
              onClick={() => {
                handleSkipButton();
              }}
            >
              Skip
            </div>
            <div
              className="submit-button"
              onClick={() => {
                submitAnswer();
              }}
            >
              Submit
            </div>
          </div>
        </div>
      </div>
      {showResponseModal && (
        <GeneralAnswerModal
          onNext={handleNextButton}
          onClose={handleCloseButton}
          gptResponse={gptResponse}
        />
      )}
    </div>
  );
};
