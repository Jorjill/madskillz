import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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

export const practiceThunks = {
  fetchQuestions: () => async (dispatch: any) => {
    const generalresponse = await axios.get(
      `${import.meta.env.VITE_API_URL}/general-question`,
      getAuthHeaders()
    );
    dispatch(practiceSlice.actions.addGeneralQuestions(generalresponse.data));
    const specificresponse = await axios.get(
      `${import.meta.env.VITE_API_URL}/specific-question`,
      getAuthHeaders()
    );
    dispatch(practiceSlice.actions.addSpecificQuestions(specificresponse.data));
    const pastresponse = await axios.get(
      `${import.meta.env.VITE_API_URL}/experience-question`,
      getAuthHeaders()
    );
    dispatch(practiceSlice.actions.addPastQuestions(pastresponse.data));
  },
  deleteGeneralQuestion: (question: any) => async (dispatch: any) => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/general-question/${question.id}`,
      getAuthHeaders()
    );
    dispatch(practiceThunks.fetchQuestions());
  },
  createQuestion:
    (question: string, answer: string, skill: string) =>
    async (dispatch: any) => {
      try {
        console.log("skills is: "+skill);
        
        await axios.post(
          `${import.meta.env.VITE_API_URL}/general-question`,
          { question: question, answer: answer, skill: skill },
          getAuthHeaders()
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
