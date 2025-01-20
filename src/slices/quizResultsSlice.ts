import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

export interface QuizResult {
  id: number;
  user_id: string;
  quiz_name: string;
  status: "PASS" | "FAIL";
  correct_answers: number;
  total_questions: number;
  created_at: string;
  skill: string;
}

interface QuizResultsState {
  results: QuizResult[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizResultsState = {
  results: [],
  loading: false,
  error: null,
};

const quizResultsSlice = createSlice({
  name: "quizResults",
  initialState,
  reducers: {
    setResults: (state, action) => {
      state.results = action.payload;
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
  },
});

export const quizResultsThunks = {
  fetchResults: () => async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/quiz-results`,
        getAuthHeaders()
      );
      dispatch(setResults(response.data));
    } catch (error) {
      console.error("Failed to fetch quiz results:", error);
      dispatch(setError("Failed to fetch quiz results"));
    }
  },
};

export const { setResults, setLoading, setError } = quizResultsSlice.actions;
export default quizResultsSlice.reducer;
