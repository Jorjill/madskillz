import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Question {
  id: string;
  quizId: string;
  title: string;
  text: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  skill: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizState {
  quizzes: Quiz[];
  selectedQuiz: Quiz | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  selectedQuiz: null,
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
      state.loading = false;
      state.error = null;
    },
    selectQuiz: (state, action) => {
      state.selectedQuiz = action.payload;
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

export const quizActions = quizSlice.actions;

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

export const quizThunks = {
  fetchQuizzes: (skillName: string) => async (dispatch: any, getState: any) => {
    dispatch(quizActions.setLoading(true));
    try {
      const quizzes = import.meta.env.VITE_DEV === "true"
        ? [{
            id: "1",
            title: "Basic Quiz",
            skill: skillName,
            questions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }]
        : (await axios.get(
            `${import.meta.env.VITE_API_URL}/quizzes/${skillName}`,
            getAuthHeaders()
          )).data;

      dispatch(quizActions.setQuizzes(quizzes));
      
      const { selectedQuiz } = getState().quiz;
      if (selectedQuiz) {
        const updatedQuiz = quizzes.find((q: Quiz) => q.id === selectedQuiz.id);
        updatedQuiz && dispatch(quizActions.selectQuiz(updatedQuiz));
      }
    } catch (error) {
      dispatch(quizActions.setError(error instanceof Error ? error.message : "Failed to fetch quizzes"));
    } finally {
      dispatch(quizActions.setLoading(false));
    }
  },

  createQuiz: (newQuiz: Omit<Quiz, "id" | "createdAt" | "updatedAt">) => async (dispatch: any) => {
    try {
      dispatch(quizActions.setLoading(true));
      if (import.meta.env.VITE_DEV === "true") {
        const mockQuiz = {
          ...newQuiz,
          id: Math.random().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dispatch(quizActions.setQuizzes([mockQuiz]));
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/quizzes`,
          newQuiz,
          getAuthHeaders()
        );
        // Refresh quizzes after creation
        dispatch(quizThunks.fetchQuizzes(newQuiz.skill));
      }
    } catch (error) {
      dispatch(quizActions.setError(error instanceof Error ? error.message : "Failed to create quiz"));
    }
  },

  updateQuiz: (quizId: string, updatedQuiz: Partial<Quiz>) => async (dispatch: any) => {
    try {
      dispatch(quizActions.setLoading(true));
      if (import.meta.env.VITE_DEV === "true") {
        // Mock update in dev mode
        console.log("Updating quiz:", { quizId, updatedQuiz });
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/quizzes/${quizId}`,
          updatedQuiz,
          getAuthHeaders()
        );
        // Refresh quizzes after update
        if (updatedQuiz.skill) {
          dispatch(quizThunks.fetchQuizzes(updatedQuiz.skill));
        }
      }
    } catch (error) {
      dispatch(quizActions.setError(error instanceof Error ? error.message : "Failed to update quiz"));
    }
  },

  deleteQuiz: (quizId: string, skillName: string) => async (dispatch: any) => {
    try {
      dispatch(quizActions.setLoading(true));
      if (import.meta.env.VITE_DEV === "true") {
        console.log("Deleting quiz:", quizId);
      } else {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/quizzes/${quizId}`,
          getAuthHeaders()
        );
        // Refresh quizzes after deletion
        dispatch(quizThunks.fetchQuizzes(skillName));
      }
    } catch (error) {
      dispatch(quizActions.setError(error instanceof Error ? error.message : "Failed to delete quiz"));
    }
  },

  createQuestion: (params: { quizId: string; text: string; answer: string }) => async (dispatch: any) => {
    try {
      dispatch(quizActions.setLoading(true));
      if (import.meta.env.VITE_DEV === "true") {
        const mockQuestion = {
          id: Math.random().toString(),
          quizId: params.quizId,
          text: params.text,
          answer: params.answer,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        console.log("Created question:", mockQuestion);
      } else {
        // Create the question
        const createResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/quizzes/${params.quizId}/questions`,
          {
            text: params.text,
            answer: params.answer
          },
          getAuthHeaders()
        );
        console.log("Question created:", createResponse.data);
        
        // Get the updated quiz
        // const quizResponse = await axios.get(
        //   `${import.meta.env.VITE_API_URL}/quizzes/${params.quizId}`,
        //   getAuthHeaders()
        // );
        // console.log("Updated quiz:", quizResponse.data);
        
        // // Update both the quizzes list and selected quiz
        // const state = selectQuizState({ quiz: initialState });
        // const updatedQuizzes = state.quizzes.map(quiz => 
        //   quiz.id === params.quizId ? quizResponse.data : quiz
        // );
        
        // dispatch(quizActions.setQuizzes(updatedQuizzes));
        // dispatch(quizActions.selectQuiz(quizResponse.data));
      }
    } catch (error) {
      console.error("Failed to create question:", error);
      dispatch(quizActions.setError(error instanceof Error ? error.message : "Failed to create question"));
    } finally {
      dispatch(quizActions.setLoading(false));
    }
  },

  updateQuestion: (params: { quizId: string; questionId: string; text?: string; answer?: string }) => async (dispatch: any) => {
    try {
      dispatch(quizActions.setLoading(true));
      if (import.meta.env.VITE_DEV === "true") {
        console.log("Updating question:", params);
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/quizzes/${params.quizId}/questions/${params.questionId}`,
          {
            text: params.text,
            answer: params.answer
          },
          getAuthHeaders()
        );
      }
      // Refresh the quiz to get updated questions
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/quizzes/${params.quizId}`,
        getAuthHeaders()
      );
      dispatch(quizActions.selectQuiz(response.data));
    } catch (error) {
      dispatch(quizActions.setError(error instanceof Error ? error.message : "Failed to update question"));
    }
  },

  deleteQuestion: (params: { quizId: string; questionId: string }) => async (dispatch: any) => {
    try {
      dispatch(quizActions.setLoading(true));
      if (import.meta.env.VITE_DEV === "true") {
        console.log("Deleting question:", params.questionId);
      } else {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/quizzes/${params.quizId}/questions/${params.questionId}`,
          getAuthHeaders()
        );
      }
      // Refresh the quiz to get updated questions
      // const response = await axios.get(
      //   `${import.meta.env.VITE_API_URL}/quizzes/${params.quizId}`,
      //   getAuthHeaders()
      // );
      // dispatch(quizActions.selectQuiz(response.data));
    } catch (error) {
      dispatch(quizActions.setError(error instanceof Error ? error.message : "Failed to delete question"));
    }
  },
};

export const selectQuizState = (state: { quiz: QuizState }) => state.quiz;

export const { setQuizzes, selectQuiz, setLoading, setError } = quizSlice.actions;
export default quizSlice.reducer;
