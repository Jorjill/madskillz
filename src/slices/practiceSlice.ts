import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface generalQuestion {
  question: String;
  answer: String;
  skill: String;
}

interface practiceState {
  practiceMode: String;
  generalQuestions: generalQuestion[];
  specificQuestions: String[];
  pastQuestions: String[];
  testQuestions: String[];
}

const initialState: practiceState = {
  practiceMode: "general",
  generalQuestions: [],
  specificQuestions: ["specific 1", "specific 2", "specific 3"],
  pastQuestions: ["past 1", "past 2", "past 3"],
  testQuestions: ["test 1", "test 2", "test 3"],
};

const practiceSlice = createSlice({
  name: "practice",
  initialState,
  reducers: {
    addGeneralQuestions: (state, actions) => {
      state.generalQuestions = actions.payload;
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

export const selectRandomGeneralQuestionBySkill = (
  questions: any,
  skill: string
) => {
  const filteredQuestions = questions.filter(
    (question: any) => question.skill === skill
  );
  return getRandomItem(filteredQuestions);
};

export const selectRandomGeneralQuestion = (state: any) =>
  getRandomItem(state.practice.generalQuestions);

export const selectRandomSpecificQuestion = (state: any) =>
  getRandomItem(state.practice.specificQuestions);

export const selectRandomPastQuestion = (state: any) =>
  getRandomItem(state.practice.pastQuestions);

export const selectRandomTestQuestion = (state: any) =>
  getRandomItem(state.practice.testQuestions);

export const practiceThunks = {
  fetchGeneralQuestions: () => async (dispatch: any) => {
    const response = await axios.get("http://localhost:3000/general-question");
    dispatch(practiceSlice.actions.addGeneralQuestions(response.data));
  },
};

export const selectPracticeMode = (state: any) => state.page.practiceMode;
export const { chooseMode } = practiceSlice.actions;
export default practiceSlice.reducer;
