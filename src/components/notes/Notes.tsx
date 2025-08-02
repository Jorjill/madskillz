/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Note } from "../note/note";
import { AddNote } from "../add-note/addnote";
import { EditNote } from "../edit-note/editnote";
import { NotesList } from "../notes-list/notes-list";
import { deselectNote } from "../../slices/notesSlice";
import "./Notes.less";

const Notes: React.FC = () => {
  const dispatch = useDispatch();
  const isEditNoteMode = useSelector(
    (state: any) => state.notes.isEditNoteMode
  );
  const isNoteSelected = useSelector(
    (state: any) => state.notes.isNoteSelected
  );
  const isAddNoteMode = useSelector((state: any) => state.notes.isAddNoteMode);

  const handleBackToNotes = () => {
    dispatch(deselectNote());
  };

  if (isAddNoteMode) {
    return <AddNote />;
  } else if (isNoteSelected && !isEditNoteMode) {
    return (
      <div className="notes-container">
        <div className="notes-navigation">
          <button className="back-button" onClick={handleBackToNotes}>
            <i className="ri-arrow-left-line"></i>
            Back to Notes
          </button>
        </div>
        <Note />
      </div>
    );
  } else if (isNoteSelected && isEditNoteMode) {
    return (
      <div className="notes-container">
        <div className="notes-navigation">
          <button className="back-button" onClick={handleBackToNotes}>
            <i className="ri-arrow-left-line"></i>
            Back to Notes
          </button>
        </div>
        <EditNote />
      </div>
    );
  } else {
    return <NotesList />;
  }
};

export default Notes;
