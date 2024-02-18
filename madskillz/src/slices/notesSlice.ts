import { createSelector, createSlice } from "@reduxjs/toolkit";

export interface note {
  title: string;
  content: string;
  noteSkill: string;
}

export interface notesState {
  isNoteSelected: boolean;
  isAddNoteMode: boolean;
  notes: note[];
}

const initialState: notesState = {
  isNoteSelected: false,
  isAddNoteMode: false,
  notes: [
    { title: "react", content: "content1", noteSkill: "REACT" },
    { title: "node", content: "content2", noteSkill: "node" },
    { title: "react", content: "content3", noteSkill: "REACT" },
    { title: "react", content: "content4", noteSkill: "REACT" },
    { title: "angular", content: "content5", noteSkill: "angular" },
    { title: "react", content: "content3", noteSkill: "REACT" },
    { title: "react", content: "content4", noteSkill: "REACT" },
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
    selectNoteMode: (state) => {
      state.isAddNoteMode = true;
    },
    deselectNoteMode: (state) => {
      state.isAddNoteMode = false;
    },
  },
});

export const selectNotes = (state: { notes: notesState }) => state.notes.notes;
export const selectNoteByTitle = createSelector(
  [selectNotes, (state, title: string) => title],
  (notes, title) => notes.find((note) => note.title === title)
);
export const selectNotesBySkill = createSelector(
  [selectNotes, (state, noteSkill: string) => noteSkill],
  (notes, noteSkill) => notes.filter((note) => note.noteSkill === noteSkill)
);
export const {
  addNote,
  selectNote,
  deselectNote,
  selectNoteMode,
  deselectNoteMode,
} = notesSlice.actions;
export default notesSlice.reducer;
