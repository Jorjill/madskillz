import { createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

export interface note {
  id?: string;
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
  deselectNote,
  selectAddNoteMode,
  deselectAddNoteMode,
  selectEditNoteMode,
  deselectEditNoteMode,
} = notesSlice.actions;

export const notesThunks = {
  fetchNotes: () => async (dispatch: any) => {
    try {
      const idToken = localStorage.getItem("idToken");
      if (!idToken) {
        console.error("No token found. User might not be authenticated.");
        return;
      }
      const response = await axios.get("http://localhost:3000/notes", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
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
  deleteNote: (id: string | undefined) => async (dispatch: any) => {
    try {
      await axios.delete(`http://localhost:3000/notes/${id}`);
      dispatch(notesThunks.fetchNotes());
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  },
  updateNote: (updatedNote: note) => async (dispatch: any) => {
    try {
      await axios.put(
        `http://localhost:3000/notes/${updatedNote.id}`,
        updatedNote
      );
      dispatch(notesThunks.fetchNotes());
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  },
};

export default notesSlice.reducer;
