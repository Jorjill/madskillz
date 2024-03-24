import { useDispatch, useSelector } from "react-redux";
import { addNote, deselectAddNoteMode } from "../../slices/notesSlice";
import "./addnote.less";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";

export const AddNote = () => {
  const dispatch = useDispatch();
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const quillRef = useRef<Quill | null>(null);
  
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
          setNoteContent(quillRef.current.root.innerHTML);
        }
      });
    }
  }, []);

  return (
    <div className="addnote-component">
      <div className="addnote">
        <input
          type="text"
          placeholder="Title"
          name=""
          id=""
          onChange={(t) => {
            setNoteTitle(t.target.value);
          }}
        />
        <div id="editor" style={{ height: "400px" }}></div>{" "}
        {/* This is where Quill will attach */}
        <div
          className="create-note-button"
          onClick={() => {
            dispatch(
              addNote({
                notes_title: noteTitle,
                content: noteContent,
                noteSkill: `${selectedSkill}`,
              })
            );
            dispatch(deselectAddNoteMode());
          }}
        >
          Create note
        </div>
      </div>
    </div>
  );
};
