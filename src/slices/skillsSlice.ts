import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface skill {
  id?: string;
  title: string;
  imageurl: string;
}

export interface skillsState {
  skills: skill[];
  selectedSkill: skill;
}

const initialState: skillsState = {
  skills: [],
  selectedSkill: { id: "", title: "", imageurl: "" },
};

const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    addSkills: (state, actions) => {
      state.skills = actions.payload;
    },
    selectSkill: (state, actions) => {
      state.selectedSkill = actions.payload;
    },
  },
});

export const skillsActions = skillsSlice.actions;

export const skillsThunks = {
  fetchSkills: () => async (dispatch: any) => {
    try {
      const response = await axios.get("http://localhost:3000/skills");
      dispatch(skillsActions.addSkills(response.data));
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  },
  addSkill: (newSkill: skill) => async (dispatch: any) => {
    try {
      await axios.post("http://localhost:3000/skills", newSkill);
      dispatch(skillsThunks.fetchSkills());
    } catch (error) {
      console.error("Failed to add skill:", error);
    }
  },
  deleteSkill: (id: string) => async (dispatch: any) => {
    try {
      await axios.delete(`http://localhost:3000/skills/${id}`);
      dispatch(skillsThunks.fetchSkills());
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  },
};

export const selectSkills = (state: { skills: skillsState }) =>
  state.skills.skills;

export const { selectSkill, addSkills } = skillsSlice.actions;
export default skillsSlice.reducer;
