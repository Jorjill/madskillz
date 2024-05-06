import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface skill {
  title: string;
  imageurl: string;
}

export interface skillsState {
  skills: skill[];
  selectedSkill: skill;
}

const initialState: skillsState = {
  skills: [],
  selectedSkill: { title: "", imageurl: "" },
};

const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    addSkills: (state, actions) => {
      state.skills = actions.payload;
    },
    addSkill: (state, actions) => {
      state.skills.push(actions.payload);
    },
    selectSkill: (state, actions) => {
      state.selectedSkill = actions.payload;
    },
  },
});

export const fetchSkills = createAsyncThunk(
  "skills/fetchSkills",
  async (_, { dispatch }) => {
    try {
      const response = await fetch("http://localhost:3000/skills");
      const data = await response.json();
      dispatch(addSkills(data));
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  }
);

export const selectSkills = (state: { skills: skillsState }) =>
  state.skills.skills;

export const { addSkill, selectSkill, addSkills } = skillsSlice.actions;
export default skillsSlice.reducer;
