import { useEffect, useRef, useState } from "react";
import "./practice.less";
import Quill from "quill";

export const Practice: React.FC = () => {
  const quillRef = useRef<Quill | null>(null);
  const [answerContent, setAnswerContent] = useState("");
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
        <h1>Write list of all topics of react that you know</h1>
        <div id="editor" style={{ height: "500px" }}></div>{" "}
        <div
          className="submit-button"
          onClick={() => {
            console.log("submitted");
          }}
        >
          Submit
        </div>
      </div>
    </div>
  );
};
