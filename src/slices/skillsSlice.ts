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

const getAuthHeaders = () => {
  const idToken = localStorage.getItem("idToken");
  if (!idToken) {
    throw new Error("No token found. User might not be authenticated.");
  }
  return {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
};

export const skillsThunks = {
   // @ts-ignore
  fetchSkills: () => async (dispatch: any) => {
    try {
       // @ts-ignore
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/skills`,
        getAuthHeaders()
      );
     dispatch(skillsActions.addSkills(response.data));
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  },
  addSkill: (newSkill: skill) => async (dispatch: any) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/skills`,
        newSkill,
        getAuthHeaders()
      );
      dispatch(skillsThunks.fetchSkills());
    } catch (error) {
      console.error("Failed to add skill:", error);
    }
  },
  deleteSkill: (id: string) => async (dispatch: any) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/skills/${id}`,
        getAuthHeaders()
      );
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
