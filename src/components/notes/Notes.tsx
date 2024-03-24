/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectNoteByTitle } from "../../slices/notesSlice";
import "./notes.less";
import { Note } from "../note/note";
import { AddNote } from "../add-note/addnote";
import { EditNote } from "../edit-note/editnote";
import { NotesList } from "../notes-list/notes-list";

const Notes: React.FC = () => {
  const [selectednotetitle, setSelectednotetitle] = useState("");
  const selectednote = useSelector((state) =>
    selectNoteByTitle(state, selectednotetitle)
  );
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
    } else if (isNoteSelected) {
      return <Note/>;
    } else if (isEditNoteMode) {
      return <EditNote note={selectednote} />;
    } else {
      return <NotesList />;
    }
  }
};

export default Notes;
