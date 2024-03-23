import { useDispatch, useSelector } from "react-redux";
import {
  addNote,
  deselectAddNoteMode,
  deselectEditNoteMode,
  note,
  selectNoteByTitle,
} from "../../slices/notesSlice";
import "./editnote.less";
import { useEffect, useState } from "react";

interface EditNoteProps {
  note?: note;
}

export const EditNote: React.FC<EditNoteProps> = ({ note }) => {
  const dispatch = useDispatch();
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  return (
    <div className="addnote-component">
      <div className="addnote">
        <input
          type="text"
          value={note?.notes_title}
          name=""
          id=""
          onChange={(t) => {
            setNoteTitle(t.target.value);
          }}
        />
        <textarea
          placeholder="Write notes here"
          value={note?.content}
          onChange={(t) => {
            setNoteContent(t.target.value);
          }}
        />
        <div
          className="create-note-button"
          onClick={() => {
            dispatch(deselectEditNoteMode());
          }}
        >
          Done
        </div>
      </div>
    </div>
  );
};
