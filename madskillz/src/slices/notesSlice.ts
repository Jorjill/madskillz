import { createSelector, createSlice } from "@reduxjs/toolkit";

export interface note {
  title: string;
  content: string;
}

export interface notesState {
  isNoteSelected: boolean;
  notes: note[];
}

const initialState: notesState = {
  isNoteSelected: false,
  notes: [
    { title: "title1", content: "content1" },
    { title: "title2", content: "content2" },
    { title: "title3", content: "content3" },
  ],
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, actions) => {
      state.notes.push(actions.payload);
    },
    selectNote: (state) => {
      state.isNoteSelected = true;
    },
    deselectNote: (state) => {
      state.isNoteSelected = false;
    },
  },
});

export const selectNotes = (state: { notes: notesState }) => state.notes.notes;
export const selectNoteByTitle = createSelector(
  [selectNotes, (state, title: string) => title],
  (notes, title) => notes.find((note) => note.title === title)
);
export const { addNote, selectNote, deselectNote } = notesSlice.actions;
export default notesSlice.reducer;
