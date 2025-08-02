import { createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../utils/apiClient";

interface Question {
  question: String;
  answer: String;
  skill: String;
}

interface practiceState {
  practiceMode: String;
  generalQuestions: Question[];
  specificQuestions: Question[];
  pastQuestions: Question[];
  testQuestions: Question[];
}

const initialState: practiceState = {
  practiceMode: "general",
  generalQuestions: [],
  specificQuestions: [],
  pastQuestions: [],
  testQuestions: [],
};

const practiceSlice = createSlice({
  name: "practice",
  initialState,
  reducers: {
    addGeneralQuestions: (state, actions) => {
      state.generalQuestions = actions.payload;
    },
    addSpecificQuestions: (state, actions) => {
      state.specificQuestions = actions.payload;
    },
    addPastQuestions: (state, actions) => {
      state.pastQuestions = actions.payload;
    },
    chooseMode: (state, actions) => {
      state.practiceMode = actions.payload;
    },
  },
});

let prevRandomIndex: any = null;

const getRandomItem = (items: any) => {
  if (items.length === 0) return null;
  let randomIndex = Math.floor(Math.random() * items.length);
  while (prevRandomIndex === randomIndex && items.length > 1) {
    randomIndex = Math.floor(Math.random() * items.length);
  }
  prevRandomIndex = randomIndex;
  return items[randomIndex];
};

export const selectRandomQuestionBySkill = (questions: any, skill: string) => {
  if (skill === "ALL") {
    return getRandomItem(questions);
  }
  const filteredQuestions = questions.filter(
    (question: any) => question.skill === skill
  );
  const randomItem = getRandomItem(filteredQuestions);
  return randomItem;
};

export const selectRandomGeneralQuestion = (state: any) =>
  getRandomItem(state.practice.generalQuestions);

export const selectRandomSpecificQuestion = (state: any) =>
  getRandomItem(state.practice.specificQuestions);

export const selectRandomPastQuestion = (state: any) =>
  getRandomItem(state.practice.pastQuestions);

export const selectRandomTestQuestion = (state: any) =>
  getRandomItem(state.practice.testQuestions);

// Removed getAuthHeaders - now handled by apiClient automatically

export const practiceThunks = {
  fetchQuestions: () => async (dispatch: any) => {
    const generalresponse = await apiClient.get('/general-question');
    dispatch(practiceSlice.actions.addGeneralQuestions(generalresponse.data));
    const specificresponse = await apiClient.get('/specific-question');
    dispatch(practiceSlice.actions.addSpecificQuestions(specificresponse.data));
    const pastresponse = await apiClient.get('/experience-question');
    dispatch(practiceSlice.actions.addPastQuestions(pastresponse.data));
  },
  deleteGeneralQuestion: (question: any) => async (dispatch: any) => {
    await apiClient.delete(`/general-question/${question.id}`);
    dispatch(practiceThunks.fetchQuestions());
  },
  deleteSpecificQuestion: (question: any) => async (dispatch: any) => { 
    await apiClient.delete(`/specific-question/${question.id}`);
    dispatch(practiceThunks.fetchQuestions());
  },
  createGeneralQuestion:
    (question: string, answer: string, skill: string) =>
    async (dispatch: any) => {
      try {
        await apiClient.post(
          '/general-question',
          { question: question, answer: answer, skill: skill }
        );
        dispatch(practiceThunks.fetchQuestions());
      } catch (error) {
        console.error("Failed to create note:", error);
      }
    },
  createSpecificQuestion:
    (question: string, answer: string, skill: string) =>
    async (dispatch: any) => {
      try {
        await apiClient.post(
          '/specific-question',
          { question: question, answer: answer, skill: skill }
        );
        dispatch(practiceThunks.fetchQuestions());
      } catch (error) {
        console.error("Failed to create note:", error);
      }
    },
};

export const selectPracticeMode = (state: any) => state.page.practiceMode;
export const { chooseMode } = practiceSlice.actions;
export default practiceSlice.reducer;
