import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectNote,
  selectNoteByTitle,
  selectNoteMode,
  selectNotes,
  selectNotesBySkill,
} from "../../slices/notesSlice";
import "./notes.less";
import { Note } from "../note/note";
import { AddNote } from "../add-note/addnote";

const Notes: React.FC = () => {
  const [selectednotetitle, setSelectednotetitle] = useState("");
  const addNoteMode = useSelector((state: any) => state.notes.isAddNoteMode);
  const selectednote = useSelector((state) =>
    selectNoteByTitle(state, selectednotetitle)
  );
  const isNoteSelected = useSelector(
    (state: any) => state.notes.isNoteSelected
  );
  const dispatch = useDispatch();
  const selectedSkill = useSelector(
    (state: any) => state.skills.selectedSkill.title
  );
  const reactNotes = useSelector((state) =>
    selectNotesBySkill(state, selectedSkill)
  );

  {
    if (addNoteMode) {
      return <AddNote />;
    } else if (isNoteSelected) {
      return <Note note={selectednote} />;
    } else {
      return (
        <div className="notes-component">
          <div className="add-button">
            <div
              className="button"
              onClick={() => {
                dispatch(selectNoteMode());
              }}
            >
              Create Note
            </div>
          </div>
          <div className="items-list-container">
            <div className="items-list">
              {reactNotes.map((item, index) => (
                <div
                  className="list-box"
                  key={index}
                  onClick={() => {
                    setSelectednotetitle(item.title);
                    dispatch(selectNote());
                  }}
                >
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }
};

export default Notes;
