import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetQuizState } from "./quizSlice";

export interface skill {
  id?: string;
  title: string;
  imageurl: string;
}

export interface skillsState {
  skills: skill[];
  selectedSkill: skill;
  loading: boolean;
  error: string | null;
}

const initialState: skillsState = {
  skills: [],
  selectedSkill: { id: "", title: "", imageurl: "" },
  loading: false,
  error: null,
};

const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    setSkills: (state, action) => {
      state.skills = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    selectSkill: (state, action) => {
      state.selectedSkill = action.payload;
    },
    deselectSkill: (state) => {
      state.selectedSkill = initialState.selectedSkill;
    },
  },
});

export const skillsActions = skillsSlice.actions;
export const { setSkills, setLoading, setError, selectSkill, deselectSkill } = skillsSlice.actions;

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
  fetchSkills: () => async (dispatch: any) => {
    dispatch(skillsActions.setLoading(true));
    try {
      const skills = import.meta.env.VITE_DEV === "true"
        ? []
        : (await axios.get(
            `${import.meta.env.VITE_API_URL}/skills`,
            getAuthHeaders()
          )).data;
      dispatch(skillsActions.setSkills(skills));
    } catch (error) {
      dispatch(skillsActions.setError((error as Error).message));
    }
  },
  selectSkill: (skill: skill) => async (dispatch: any) => {
    dispatch(resetQuizState());
    dispatch(skillsActions.selectSkill(skill));
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
  updateSkill: (id: string, updatedSkill: Partial<skill>) => async (dispatch: any) => {
    try {
      if (import.meta.env.VITE_DEV === "true") {
        // In development mode, use offline data
        const skills = JSON.parse(localStorage.getItem('skills') || '[]');
        const index = skills.findIndex((s: skill) => s.id === id);
        if (index !== -1) {
          skills[index] = { ...skills[index], ...updatedSkill };
          localStorage.setItem('skills', JSON.stringify(skills));
          dispatch(skillsThunks.fetchSkills());
        }
      } else {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/skills/${id}`,
          updatedSkill,
          getAuthHeaders()
        );
        dispatch(skillsThunks.fetchSkills());
      }
    } catch (error) {
      console.error("Failed to update skill:", error);
    }
  }
};

export const selectSkills = (state: { skills: skillsState }) =>
  state.skills.skills;

export default skillsSlice.reducer;
