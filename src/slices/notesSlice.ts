import { createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

export interface note {
  title: string;
  content: string;
  noteSkill: string;
}

export interface notesState {
  isNoteSelected: boolean;
  isAddNoteMode: boolean;
  isEditNoteMode: boolean;
  notes: note[];
}

const initialState: notesState = {
  isNoteSelected: false,
  isAddNoteMode: false,
  isEditNoteMode: false,
  notes: [
    {
      title: "Create Typescript React Vite App in NX",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum .Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      noteSkill: "REACT",
    },
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
    // deleteNote: (state, actions) => {
    //   state.notes.
    // },
    selectNote: (state) => {
      state.isNoteSelected = true;
    },
    deselectNote: (state) => {
      state.isNoteSelected = false;
    },
    selectAddNoteMode: (state) => {
      state.isAddNoteMode = true;
    },
    deselectAddNoteMode: (state) => {
      state.isAddNoteMode = false;
    },
    selectEditNoteMode: (state) => {
      state.isEditNoteMode = true;
    },
    deselectEditNoteMode: (state) => {
      state.isEditNoteMode = false;
    },
  },
});

export const selectNotes = (state: RootState) => state.notes.notes;
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
  selectAddNoteMode,
  deselectAddNoteMode,
  selectEditNoteMode,
  deselectEditNoteMode,
} = notesSlice.actions;
export default notesSlice.reducer;
