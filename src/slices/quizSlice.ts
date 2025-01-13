import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Types
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

interface QuizState {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
}

// Thunks
export const quizThunks = {
  fetchQuizzes: createAsyncThunk(
    'quiz/fetchQuizzes',
    async (skillName: string) => {
      if (import.meta.env.VITE_DEV === 'true') {
        return sampleQuizzes[skillName.toLowerCase()] || [];
      }
      return [];
    }
  ),

  createQuiz: createAsyncThunk(
    'quiz/createQuiz',
    async ({ skill, title = 'New Quiz' }: { skill: string; title?: string }) => {
      const newQuiz: Quiz = {
        id: `quiz_${Date.now()}`,
        title: title,
        skill: skill.toLowerCase(),
        questions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (import.meta.env.VITE_DEV === 'true') {
        return newQuiz;
      }
      return newQuiz;
    }
  ),

  createQuestion: createAsyncThunk(
    'quiz/createQuestion',
    async ({ 
      quizId, 
      title = 'New Question',
      text = '',
      answer = ''
    }: { 
      quizId: string; 
      title?: string;
      text?: string;
      answer?: string;
    }) => {
      const newQuestion: Question = {
        id: `question_${Date.now()}`,
        quizId,
        title,
        text,
        answer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (import.meta.env.VITE_DEV === 'true') {
        return newQuestion;
      }
      return newQuestion;
    }
  ),

  updateQuiz: createAsyncThunk(
    'quiz/updateQuiz',
    async ({ quizId, title }: { quizId: string; title: string }) => {
      if (import.meta.env.VITE_DEV === 'true') {
        return { id: quizId, title };
      }
      return { id: quizId, title };
    }
  ),

  updateQuestion: createAsyncThunk(
    'quiz/updateQuestion',
    async ({ 
      quizId, 
      questionId, 
      text, 
      answer 
    }: { 
      quizId: string; 
      questionId: string; 
      text: string; 
      answer: string;
    }) => {
      const updatedQuestion: Partial<Question> = {
        id: questionId,
        quizId,
        text,
        answer,
        updatedAt: new Date().toISOString()
      };

      if (import.meta.env.VITE_DEV === 'true') {
        return updatedQuestion;
      }
      return updatedQuestion;
    }
  ),

  deleteQuiz: createAsyncThunk(
    'quiz/deleteQuiz',
    async (quizId: string) => {
      if (import.meta.env.VITE_DEV === 'true') {
        return quizId;
      }
      return quizId;
    }
  ),

  deleteQuestion: createAsyncThunk(
    'quiz/deleteQuestion',
    async ({ quizId, questionId }: { quizId: string; questionId: string }) => {
      if (import.meta.env.VITE_DEV === 'true') {
        return { quizId, questionId };
      }
      return { quizId, questionId };
    }
  )
};

// Sample data for development
const sampleQuizzes: { [key: string]: Quiz[] } = {
  'javascript': [
    {
      id: 'js_quiz_1',
      title: 'JavaScript Basics',
      skill: 'javascript',
      questions: [
        {
          id: 'js_q1',
          quizId: 'js_quiz_1',
          title: 'Variables',
          text: 'What are the different ways to declare variables in JavaScript?',
          answer: 'Variables in JavaScript can be declared using: var, let, and const.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

// Initial state
const initialState: QuizState = {
  quizzes: [],
  loading: false,
  error: null,
};

// Slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch quizzes
      .addCase(quizThunks.fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(quizThunks.fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(quizThunks.fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quizzes';
      })

      // Create quiz
      .addCase(quizThunks.createQuiz.fulfilled, (state, action) => {
        state.quizzes.push(action.payload);
      })

      // Update quiz
      .addCase(quizThunks.updateQuiz.fulfilled, (state, action) => {
        const index = state.quizzes.findIndex(quiz => quiz.id === action.payload.id);
        if (index !== -1) {
          state.quizzes[index].title = action.payload.title;
          state.quizzes[index].updatedAt = new Date().toISOString();
        }
      })

      // Delete quiz
      .addCase(quizThunks.deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(quiz => quiz.id !== action.payload);
      })

      // Create question
      .addCase(quizThunks.createQuestion.fulfilled, (state, action) => {
        const quiz = state.quizzes.find(q => q.id === action.payload.quizId);
        if (quiz) {
          quiz.questions.push(action.payload);
          quiz.updatedAt = new Date().toISOString();
        }
      })

      // Update question
      .addCase(quizThunks.updateQuestion.fulfilled, (state, action) => {
        const quiz = state.quizzes.find(q => q.id === action.payload.quizId);
        if (quiz) {
          const questionIndex = quiz.questions.findIndex(q => q.id === action.payload.id);
          if (questionIndex !== -1) {
            quiz.questions[questionIndex] = {
              ...quiz.questions[questionIndex],
              ...action.payload,
              updatedAt: new Date().toISOString()
            };
            quiz.updatedAt = new Date().toISOString();
          }
        }
      })

      // Delete question
      .addCase(quizThunks.deleteQuestion.fulfilled, (state, action) => {
        const quiz = state.quizzes.find(q => q.id === action.payload.quizId);
        if (quiz) {
          quiz.questions = quiz.questions.filter(q => q.id !== action.payload.questionId);
          quiz.updatedAt = new Date().toISOString();
        }
      });
  },
});

export default quizSlice.reducer;
