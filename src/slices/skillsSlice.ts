import { createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../utils/apiClient";
import { resetQuizState } from "./quizSlice";

export interface skill {
  id?: string;
  title: string;
  imageurl: string;
  position?: number;
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
    setSkillsOrder: (state, action) => {
      state.skills = action.payload;
    },
  },
});

export const skillsActions = skillsSlice.actions;
export const { setSkills, setLoading, setError, selectSkill, deselectSkill, setSkillsOrder } = skillsSlice.actions;

// Removed getAuthHeaders - now handled by apiClient automatically

export const skillsThunks = {
  fetchSkills: () => async (dispatch: any) => {
    dispatch(skillsActions.setLoading(true));
    try {
      const skills = import.meta.env.VITE_DEV === "true"
        ? []
        : (await apiClient.get('/skills')).data;
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
      await apiClient.post('/skills', newSkill);
      dispatch(skillsThunks.fetchSkills());
    } catch (error) {
      console.error("Failed to add skill:", error);
    }
  },
  deleteSkill: (id: string) => async (dispatch: any) => {
    try {
      await apiClient.delete(`/skills/${id}`);
      dispatch(skillsThunks.fetchSkills());
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  },
  reorderSkills: (orderedSkills: skill[]) => async (dispatch: any) => {
    dispatch(skillsActions.setSkillsOrder(orderedSkills));
    try {
      await apiClient.patch('/skills/reorder', {
        skills: orderedSkills.map((s, idx) => ({ id: s.id, position: idx }))
      });
    } catch (error) {
      console.error("Failed to reorder skills:", error);
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
        await apiClient.patch(`/skills/${id}`, updatedSkill);
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
