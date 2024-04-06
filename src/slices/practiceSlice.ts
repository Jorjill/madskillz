import { createSlice } from "@reduxjs/toolkit";

interface practiceState {
  practiceMode: String;
  generalQuestions: String[];
  specificQuestions: String[];
  pastQuestions: String[];
  testQuestions: String[];
}

const initialState: practiceState = {
    practiceMode: "general",
    generalQuestions: ["general 1","general 2","general 3"],
    specificQuestions: ["specific 1","specific 2","specific 3"],
    pastQuestions: ["past 1","past 2","past 3"],
    testQuestions: ["test 1","test 2","test 3"]
};

const practiceSlice = createSlice({
  name: "practice",
  initialState,
  reducers: {
    chooseMode: (state, actions) => {
      state.practiceMode = actions.payload;
    },
  },
});

const getRandomItem = (items: String[]) => {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

export const selectRandomGeneralQuestion = (state: any) =>
  getRandomItem(state.practice.generalQuestions);

export const selectRandomSpecificQuestion = (state: any) =>
  getRandomItem(state.practice.specificQuestions);

export const selectRandomPastQuestion = (state: any) =>
  getRandomItem(state.practice.pastQuestions);

export const selectRandomTestQuestion = (state: any) =>
  getRandomItem(state.practice.testQuestions);

export const selectPracticeMode = (state: any) =>
  state.page.practiceMode;
export const { chooseMode } = practiceSlice.actions;
export default practiceSlice.reducer;
