/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import "./edit-topic.less";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {
  referenceThunks,
  selectReferenceBySkill,
  unsetEditReferenceMode,
} from "../../slices/referenceSlice";

interface EditTopicProps {
  id: string;
}

export const EditTopic: React.FC<EditTopicProps> = ({ id }) => {
  const dispatch = useDispatch();
  const quillRef = useRef<Quill | null>(null);
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );

  const selectedReference = useSelector((state) =>
    selectReferenceBySkill(state, selectedSkill)
  );
  const topics = selectedReference?.topics;
  const selectedTopic: any = topics?.find((topic) => topic.id === id);

  const [topicTitle, setTopicTitle] = useState(selectedTopic?.title || "");
  const [topicContent, setTopicContent] = useState(
    selectedTopic?.content || ""
  );

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
          setTopicContent(quillRef.current.root.innerHTML);
        }
      });
    }

    // Set initial content if editing an existing note
    if (selectedTopic && selectedTopic.content && quillRef.current) {
      quillRef.current.root.innerHTML = selectedTopic.content;
    }
  }, [selectedTopic]);

  return (
    <div className="edit-topic-component">
      <div className="addnote">
        <div className="input-and-close">
          <input
            className="topic-title-input"
            type="text"
            value={topicTitle}
            onChange={(e) => setTopicTitle(e.target.value)}
          />
          <i
            className="ri-close-line"
            onClick={() => {
              dispatch(unsetEditReferenceMode());
            }}
          ></i>
        </div>
        <div id="editor" style={{ height: "400px" }}></div>{" "}
        {/* This is where Quill will attach */}
        <div
          className="create-note-button"
          onClick={() => {
            dispatch<any>(
              referenceThunks.updateTopic(
                selectedTopic?.id,
                topicTitle,
                topicContent,
                selectedSkill
              )
            );
            dispatch(unsetEditReferenceMode());
          }}
        >
          Done
        </div>
      </div>
    </div>
  );
};
