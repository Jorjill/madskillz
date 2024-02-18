import { createSlice } from "@reduxjs/toolkit";

export interface skill {
  title: string;
  imageurl: string;
}

export interface skillsState {
  skills: skill[];
  selectedSkill: skill;
}

const initialState: skillsState = {
  skills: [
    { title: "REACT", imageurl: "" },
    { title: "angular", imageurl: "" },
    { title: "node", imageurl: "" },
    { title: "REACT", imageurl: "" },
    { title: "REACT", imageurl: "" },
    { title: "REACT", imageurl: "" },
    { title: "REACT", imageurl: "" }
  ],
  selectedSkill: {title:"", imageurl:""}
};

const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    addSkill: (state, actions) => {
      state.skills.push(actions.payload);
    },
    selectSkill: (state, actions) => {
      state.selectedSkill = actions.payload;
    }
  },
});

export const selectSkills = (state: { skills: skillsState }) =>
  state.skills.skills;

export const { addSkill, selectSkill } = skillsSlice.actions;
export default skillsSlice.reducer;
