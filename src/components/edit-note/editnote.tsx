/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import {
  addNote,
  deselectAddNoteMode,
  deselectEditNoteMode,
  note,
  selectNoteByTitle,
  updateNote,
} from "../../slices/notesSlice";
import "./editnote.less";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface EditNoteProps {
  note?: note;
}

export const EditNote: React.FC<EditNoteProps> = ({ note }) => {
  const dispatch = useDispatch();
  const quillRef = useRef<Quill | null>(null);
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const [noteTitle, setNoteTitle] = useState(note?.notes_title || "");
  const [noteContent, setNoteContent] = useState(note?.content || "");

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

    // Set initial content if editing an existing note
    if (note && note.content && quillRef.current) {
      quillRef.current.root.innerHTML = note.content;
    }
  }, [note]);

  return (
    <div className="addnote-component">
      <div className="addnote">
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />
        <div id="editor" style={{ height: "400px" }}></div>{" "}
        {/* This is where Quill will attach */}
        <div
          className="create-note-button"
          onClick={() => {
            dispatch(
              updateNote({
                ...note,
                notes_title: noteTitle,
                content: noteContent,
                noteSkill: selectedSkill,
                datetime: new Date().toISOString(), // for updating the datetime to the current time
              })
            );
            dispatch(deselectEditNoteMode());
          }}
        >
          Done
        </div>
      </div>
    </div>
  );
};
