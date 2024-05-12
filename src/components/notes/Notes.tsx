/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useSelector } from "react-redux";
import { Note } from "../note/note";
import { AddNote } from "../add-note/addnote";
import { EditNote } from "../edit-note/editnote";
import { NotesList } from "../notes-list/notes-list";

const Notes: React.FC = () => {
  const isEditNoteMode = useSelector(
    (state: any) => state.notes.isEditNoteMode
  );
  const isNoteSelected = useSelector(
    (state: any) => state.notes.isNoteSelected
  );
  const isAddNoteMode = useSelector((state: any) => state.notes.isAddNoteMode);

  {
    if (isAddNoteMode) {
      return <AddNote />;
    } else if (isNoteSelected && !isEditNoteMode) {
      return <Note />;
    } else if (isNoteSelected && isEditNoteMode) {
      return <EditNote />;
    } else {
      return <NotesList />;
    }
  }
};

export default Notes;
