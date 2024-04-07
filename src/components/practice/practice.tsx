import { useEffect, useRef, useState } from "react";
import "./practice.less";
import Quill from "quill";
import { useDispatch, useSelector } from "react-redux";
import { choosePage } from "../../slices/pageSlice";
import {
  selectRandomGeneralQuestion,
  selectRandomPastQuestion,
  selectRandomSpecificQuestion,
  selectRandomTestQuestion,
} from "../../slices/practiceSlice";

export const Practice: React.FC = () => {
  const dispatch = useDispatch();
  const quillRef = useRef<Quill | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const practiceMode = useSelector((state: any) => state.practice.practiceMode);
  const randomGeneralQuestion = useSelector(selectRandomGeneralQuestion);
  const randomSpecificQuestion = useSelector(selectRandomSpecificQuestion);
  const randomPastQuestion = useSelector(selectRandomPastQuestion);

  useEffect(() => {
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
          setAnswerContent(quillRef.current.root.innerHTML);
        }
      });
    }
  }, []);

  return (
    <div className="practice-container">
      <div className="practice">
        {practiceMode === "general" ? (
          <h1>{randomGeneralQuestion}</h1>
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
            dispatch(choosePage("loading"));
          }}
        >
          Submit
        </div>
      </div>
    </div>
  );
};
