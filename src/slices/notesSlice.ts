import { createSelector, createSlice } from "@reduxjs/toolkit";

export interface note {
  notes_title: string;
  content: string;
  noteSkill: string;
  datetime: string; // ISO 8601 format, e.g., "2023-03-23T10:00:00Z"
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
      notes_title: "Create Typescript React Vite App in NX",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum .Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      noteSkill: "REACT",
      datetime:"2023-03-23T10:00:00Z"
    },
    {
      notes_title: "something 2",
      content: "something",
      noteSkill: "REACT",
      datetime: "2023-03-23T10:00:00Z"
    },
  ],
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, actions) => {
      state.notes.push(actions.payload);
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(
        (note) => note.notes_title !== action.payload
      );
    },
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

export const selectNotes = (state: { notes: notesState }) => state.notes.notes;

export const selectNoteByTitle = createSelector(
  [selectNotes, (state, title: string | undefined) => title],
  (notes, title) => notes.find((note) => note.notes_title === title)
);

export const selectNotesBySkill = createSelector(
  [selectNotes, (state, noteSkill: string) => noteSkill],
  (notes, noteSkill) => notes.filter((note) => note.noteSkill === noteSkill)
);
export const {
  addNote,
  selectNote,
  deleteNote,
  deselectNote,
  selectAddNoteMode,
  deselectAddNoteMode,
  selectEditNoteMode,
  deselectEditNoteMode,
} = notesSlice.actions;
export default notesSlice.reducer;
