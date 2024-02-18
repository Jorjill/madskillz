import { useDispatch, useSelector } from "react-redux";
import { addNote, deselectAddNoteMode } from "../../slices/notesSlice";
import "./editnote.less";
import { useState } from "react";

export const EditNote = () => {
  const dispatch = useDispatch();
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  return (
    <div className="addnote-component">
      <div className="addnote">
        <p>edit mode</p>
        <input
          type="text"
          placeholder="Title"
          name=""
          id=""
          onChange={(t) => {
            setNoteTitle(t.target.value);
          }}
        />
        <textarea
          placeholder="Write notes here"
          onChange={(t) => {
            setNoteContent(t.target.value);
          }}
        />
        <div
          className="create-note-button"
          onClick={() => {
            dispatch(
              addNote({
                title: noteTitle,
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
