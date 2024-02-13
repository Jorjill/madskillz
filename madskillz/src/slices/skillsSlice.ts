import { createSlice } from "@reduxjs/toolkit";

export interface skill {
  title: string;
  imageurl: string;
}

export interface skillsState {
  skills: skill[];
}

const initialState: skillsState = {
  skills: [{ title: "react", imageurl: "" }],
};

const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    addSkill: (state, actions) => {
      state.skills.push(actions.payload);
    },
  },
});

export const selectSkills = (state: {skills: skillsState}) => state.skills.skills;
export const { addSkill } = skillsSlice.actions;
export default skillsSlice.reducer;