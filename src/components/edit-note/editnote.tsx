/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import {
  deselectEditNoteMode,
  deselectNote,
  notesThunks,
  selectNoteByTitle,
} from "../../slices/notesSlice";
import "./editnote.less";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { choosePage } from "../../slices/pageSlice";

export const EditNote: React.FC = () => {
  const dispatch = useDispatch();
  const quillRef = useRef<Quill | null>(null);
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );

  const selectedNoteTitle = useSelector(
    (state: any) => state.notes.selectedNoteTitle
  );
  const note = useSelector((state) =>
    selectNoteByTitle(state, selectedNoteTitle)
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
          clipboard: {
            matchVisual: false
          },
          keyboard: {
            bindings: {
              'list autofill': {
                prefix: /^\d+\./,
                handler: function() {
                  return true; // Prevents auto-formatting
                }
              }
            }
          }
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
        <div
          id="editor"
          style={{
            height: "400px",
            width: "35vw",
          }}
        ></div>{" "}
        {/* This is where Quill will attach */}
        <div
          className="create-note-button"
          onClick={() => {
            dispatch<any>(
              notesThunks.updateNote({
                id: note?.id,
                notes_title: noteTitle,
                content: noteContent,
                noteSkill: selectedSkill,
                datetime: new Date().toISOString(), // for updating the datetime to the current time
                tags: [],
              })
            );
            dispatch(deselectEditNoteMode());
            dispatch(deselectNote());
            dispatch(choosePage("notes"));
          }}
        >
          Done
        </div>
      </div>
    </div>
  );
};
