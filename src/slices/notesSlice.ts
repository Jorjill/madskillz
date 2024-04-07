import { createSelector, createSlice } from "@reduxjs/toolkit";

export interface note {
  notes_title: string;
  content: string;
  noteSkill: string;
  datetime: string;
  tags: string[];
}

export interface notesState {
  selectedNoteTitle: string;
  isNoteSelected: boolean;
  isAddNoteMode: boolean;
  isEditNoteMode: boolean;
  notes: note[];
}

const initialState: notesState = {
  selectedNoteTitle: "",
  isNoteSelected: false,
  isAddNoteMode: false,
  isEditNoteMode: false,
  notes: [
    {
      notes_title: "Create Typescript React Vite App in NX",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum .Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      noteSkill: "REACT",
      datetime: "2023-03-23T10:00:00Z",
      tags: ["react","typescript"],
    },
    {
      notes_title: "something 2",
      content: "something",
      noteSkill: "REACT",
      datetime: "2023-03-23T11:00:00Z",
      tags: ["react"],
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
    updateNote: (state, action) => {
      const { notes_title, content, noteSkill, datetime, newTags } =
        action.payload;
      const existingNote = state.notes.find(
        (note) => note.notes_title === notes_title
      );
      if (existingNote) {
        existingNote.content = content;
        existingNote.noteSkill = noteSkill;
        existingNote.datetime = datetime;
        existingNote.tags = [...existingNote.tags, ...newTags];
      }
    },
    updateNoteTags: (state, action) => {
      const { notes_title, newTag } = action.payload;
      const note = state.notes.find((note) => note.notes_title === notes_title);
      if (note && !note.tags.includes(newTag)) {
        note.tags = [...note.tags, newTag];
      }
    },
    removeNoteTag: (state, action) => {
      const { notes_title, tagToRemove } = action.payload;
      const note = state.notes.find((note) => note.notes_title === notes_title);
      if (note) {
        note.tags = note.tags.filter((tag) => tag !== tagToRemove); 
      }
    },
    selectNote: (state, action) => {
      state.isNoteSelected = true;
      state.selectedNoteTitle = action.payload;
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
  updateNote,
  deselectNote,
  selectAddNoteMode,
  deselectAddNoteMode,
  selectEditNoteMode,
  deselectEditNoteMode,
} = notesSlice.actions;
export default notesSlice.reducer;
