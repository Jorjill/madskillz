import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../state/store";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  skill: string;
  question: string;
  answers: Answer[];
}

interface QuestionsState {
  questions: Question[];
  currentQuestionIndex: number;
}

const initialState: QuestionsState = {
  questions: [
    {
      skill: "REACT",
      question: "What is the capital of France?",
      answers: [
        { text: "Paris", isCorrect: true },
        { text: "London", isCorrect: false },
        { text: "Berlin", isCorrect: false },
        { text: "Madrid", isCorrect: false },
      ],
    },
    {
      skill: "angular",
      question: "What is the capital of Mongolia?",
      answers: [
        { text: "Paris", isCorrect: false },
        { text: "UB", isCorrect: true },
        { text: "Berlin", isCorrect: false },
        { text: "Madrid", isCorrect: false },
      ],
    },
    {
      skill: "REACT",
      question: "What is the capital of Russia?",
      answers: [
        { text: "Paris", isCorrect: false },
        { text: "UB", isCorrect: false },
        { text: "Moscow", isCorrect: true },
        { text: "Madrid", isCorrect: false },
      ],
    },
  ],
  currentQuestionIndex: 0,
};

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    nextQuestion(state) {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    resetTest(state) {
      state.currentQuestionIndex = 0;
    },
    setCurrentQuestion(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index >= 0 && index < state.questions.length) {
        state.currentQuestionIndex = index;
      }
    },
    randomizeQuestions(state) {
      for (let i = state.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.questions[i], state.questions[j]] = [
          state.questions[j],
          state.questions[i],
        ];
      }
    },
  },
});

export const selectQuestionsBySkill = (state: RootState, skill: string) => {
  return state.test.questions.filter(question => question.skill === skill);
};

export const {
  nextQuestion,
  resetTest,
  setCurrentQuestion,
  randomizeQuestions,
} = testSlice.actions;
export default testSlice.reducer;
