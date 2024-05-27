import { useEffect, useRef, useState } from "react";
import "./addReference.less";
import Quill from "quill";
import { useDispatch, useSelector } from "react-redux";
import {
  referenceThunks,
  selectReferenceBySkill,
  unsetAddReferenceMode,
} from "../../slices/referenceSlice";

export const AddReference: React.FC = () => {
  const quillRef = useRef<Quill | null>(null);
  const [refTitle, setRefTitle] = useState("");
  const [refContent, setRefContent] = useState("");
  const dispatch = useDispatch();
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const selectedReference = useSelector((state) =>
    selectReferenceBySkill(state, selectedSkill)
  );

  useEffect(() => {
    if (quillRef.current === null) {
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
          setRefContent(quillRef.current.root.innerHTML);
        }
      });
    }
  }, []);

  return (
    <div className="add-reference-container">
      <div className="addreference">
        <input
          value={refTitle}
          type="text"
          placeholder="Title"
          onChange={(e) => {
            setRefTitle(e.target.value);
          }}
        />
        <div id="editor"></div>
        <div
          className="create-reference-button"
          onClick={() => {
            dispatch<any>(
              referenceThunks.addTopic(selectedSkill, {
                title: refTitle,
                content: refContent,
                datetime: new Date().toISOString(),
              })
            );
            setRefTitle("");
            setRefContent("");
            if (quillRef.current) {
              quillRef.current.setText("");
            }
            dispatch(unsetAddReferenceMode());
          }}
        >
          Create Reference
        </div>
      </div>
    </div>
  );
};
