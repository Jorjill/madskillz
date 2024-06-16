import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  practiceThunks,
  selectRandomQuestionBySkill,
} from "../../slices/practiceSlice";
import { AddQuestion } from "../add-question/add-question";
import { GeneralAnswerModal } from "../general-answer-modal/general-answer-modal";
import "./practice.less";

export const Practice: React.FC = () => {
  const dispatch = useDispatch();
  const [addQuestionMode, setAddQuestionMode] = useState(false);
  const [answerContent, setAnswerContent] = useState<string>("");
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
  const [gptResponse, setGptResponse] = useState<{
    result: string;
    reason: string;
  }>({ result: "", reason: "" });
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [randomQuestion, setRandomQuestion] = useState<any>(null);

  const getAuthHeaders = () => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      throw new Error("No token found. User might not be authenticated.");
    }
    return {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
  };

  const selectNewRandomQuestion = () => {
    console.log("selectNewRandomQuestion");
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
    dispatch<any>(practiceThunks.fetchQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (
      generalQuestions.length > 0 ||
      specificQuestions.length > 0 ||
      pastQuestions.length > 0
    ) {
      selectNewRandomQuestion();
    }
  }, [
    practiceMode,
    generalQuestions,
    specificQuestions,
    pastQuestions,
    selectedSkillTitle,
  ]);

  const handleSkipButton = () => {
    selectNewRandomQuestion();
    setAnswerContent("");
  };

  const handleNextButton = () => {
    if (gptResponse.result === "PASS") {
      selectNewRandomQuestion();
      setAnswerContent("");
    }
    setShowResponseModal(false);
  };

  const handleCloseButton = () => {
    setShowResponseModal(false);
  };

  const submitAnswer = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/general-question/answer`,
      {
        question: randomQuestion?.question,
        answer: randomQuestion?.answer,
        providedAnswer: answerContent,
      },
      getAuthHeaders()
    );
    setGptResponse(res.data);
    setShowResponseModal(true);
  };

  const handleDeleteGeneralQuestion = () => {
    dispatch<any>(practiceThunks.deleteGeneralQuestion(randomQuestion));
  };

  return (
    <div className="practice-container">
      {addQuestionMode ? (
        <div className="add-question-container">
          <AddQuestion
            practiceMode={practiceMode}
            onClose={() => {
              setAddQuestionMode(false);
            }}
          />
        </div>
      ) : (
        <div className="practice-question-container">
          <div className="practice-question-and-bin">
            <h1>{randomQuestion?.question || "Loading question..."}</h1>
            <i
              className="ri-add-circle-line"
              onClick={() => {
                setAddQuestionMode(true);
              }}
            ></i>
            <i
              className="ri-delete-bin-7-line"
              onClick={() => {
                handleDeleteGeneralQuestion();
              }}
            ></i>
          </div>
          <div className="practice">
            <div className="editor-and-buttons">
              <Editor
                height="500px"
                defaultLanguage="javascript"
                value={answerContent}
                onChange={(value) => setAnswerContent(value || "")}
                theme="vs-dark"
              />
              <div className="skip-submit-buttons">
                <div className="skip-button" onClick={handleSkipButton}>
                  Skip
                </div>
                <div className="submit-button" onClick={submitAnswer}>
                  Submit
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default Practice;
