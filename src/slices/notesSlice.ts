import { createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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
  notes: [],
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNotes: (state, actions) => {
      state.notes = actions.payload;
    },
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
  (notes, noteSkill) => {
    if (noteSkill == "ALL") {
      return notes;
    }
    return notes.filter((note) => note.noteSkill === noteSkill);
  }
);

export const {
  addNotes,
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

export const notesThunks = {
  fetchNotes: () => async (dispatch: any) => {
    try {
      const response = await axios.get("http://localhost:3000/notes");
      dispatch(addNotes(response.data));
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  },
  createNote: (newNote: note) => async (dispatch: any) => {
    try {
      await axios.post("http://localhost:3000/notes", newNote);
      dispatch(notesThunks.fetchNotes());
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  },
  deleteNote: (noteTitle: string) => async (dispatch: any) => { 
    try {
      await axios.delete(`http://localhost:3000/notes/${noteTitle}`);
      dispatch(notesThunks.fetchNotes());
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  },
};

export default notesSlice.reducer;
