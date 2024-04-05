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
    generalQuestions: ["asda","dasd","xxxx"],
    specificQuestions: ["asda","dasd","xxxx"],
    pastQuestions: ["asda","dasd","xxxx"],
    testQuestions: ["asda","dasd","xxxx"]
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

export const selectPracticeMode = (state: any) =>
  state.page.practiceMode;
export const { chooseMode } = practiceSlice.actions;
export default practiceSlice.reducer;
