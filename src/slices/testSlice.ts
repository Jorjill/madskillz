import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
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
      question: "What is the capital of France?",
      answers: [
        { text: "Paris", isCorrect: true },
        { text: "London", isCorrect: false },
        { text: "Berlin", isCorrect: false },
        { text: "Madrid", isCorrect: false },
      ],
    },
    {
        question: "What is the capital of Mongolia?",
        answers: [
          { text: "Paris", isCorrect: false },
          { text: "UB", isCorrect: true },
          { text: "Berlin", isCorrect: false },
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
  },
});

export const { nextQuestion, resetTest, setCurrentQuestion } = testSlice.actions;

export default testSlice.reducer;