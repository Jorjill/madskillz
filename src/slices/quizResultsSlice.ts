import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";

export interface AnswerResult {
  reason: string;
  result: "PASS" | "FAIL";
}

export interface QuizResult {
  id: number;
  user_id: string;
  quiz_name: string;
  status: "PASS" | "FAIL";
  correct_answers: number;
  total_questions: number;
  created_at: string;
  skill: string;
  answer_results: AnswerResult[];
}

interface QuizResultsState {
  results: QuizResult[];
  performanceSummary: string;
  loading: boolean;
  error: string | null;
}

const initialState: QuizResultsState = {
  results: [],
  performanceSummary: "",
  loading: false,
  error: null,
};

const quizResultsSlice = createSlice({
  name: "quizResults",
  initialState,
  reducers: {
    setResults: (state, action) => {
      state.results = action.payload || [];
      state.loading = false;
      state.error = null;
    },
    setPerformanceSummary: (state, action) => {
      state.performanceSummary = action.payload || "";
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
      
      const results = response.data?.raw_results || [];
      dispatch(setResults(results));
      dispatch(setPerformanceSummary(response.data?.performance_summary || ""));
    } catch (error) {
      console.error("Failed to fetch quiz results:", error);
      dispatch(setError("Failed to fetch quiz results"));
      dispatch(setResults([]));
      dispatch(setPerformanceSummary(""));
    }
  },
};

export const { setResults, setPerformanceSummary, setLoading, setError } = quizResultsSlice.actions;
export default quizResultsSlice.reducer;
