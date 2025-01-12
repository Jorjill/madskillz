import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getAuthHeaders = () => {
  const idToken = localStorage.getItem('idToken');
  if (!idToken) {
    throw new Error('No token found. User might not be authenticated.');
  }
  return {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
};

// Thunks
export const quizThunks = {
  fetchQuizzes: createAsyncThunk(
    'quiz/fetchQuizzes',
    async (skillName: string) => {
      // Use lowercase skill name to match our data
      return sampleQuizzes[skillName.toLowerCase()] || [];
    }
  ),

  createQuiz: createAsyncThunk(
    'quiz/createQuiz',
    async ({ skill }: { skill: string }) => {
      const skillKey = skill.toLowerCase();
      const newQuiz = {
        id: `quiz_${Date.now()}`,
        title: `New Quiz ${sampleQuizzes[skillKey]?.length + 1 || 1}`,
        questions: []
      };
      
      if (!sampleQuizzes[skillKey]) {
        sampleQuizzes[skillKey] = [];
      }
      sampleQuizzes[skillKey].push(newQuiz);
      
      return newQuiz;
    }
  ),

  createQuestion: createAsyncThunk(
    'quiz/createQuestion',
    async ({ quizId }: { quizId: string }) => {
      const newQuestion = {
        id: `question_${Date.now()}`,
        text: 'New Question',
        answer: '',
        quizId
      };
      return newQuestion;
    }
  ),

  updateQuestionAnswer: createAsyncThunk(
    'quiz/updateQuestionAnswer',
    async ({
      quizId,
      questionId,
      answer,
    }: {
      quizId: string;
      questionId: string;
      answer: string;
    }) => {
      return { quizId, questionId, answer };
    }
  ),
};

// Sample quizzes data structure
const sampleQuizzes: { [key: string]: any[] } = {
  'javascript': [
    {
      id: 'js_quiz_1',
      title: 'JavaScript Basics',
      questions: [
        {
          id: 'js_q1',
          text: 'What is the difference between let and var?',
          answer: 'let has block scope while var has function scope. let was introduced in ES6 and provides better scoping rules for variables.'
        },
        {
          id: 'js_q2',
          text: 'Explain closures in JavaScript.',
          answer: 'A closure is the combination of a function and the lexical environment within which that function was declared. This allows a function to access variables in its outer scope even after the outer function has returned.'
        },
        {
          id: 'js_q3',
          text: 'What is the event loop?',
          answer: 'The event loop is a programming construct that waits for and dispatches events in a program. It works by making a request to some internal or external "event provider", then calls the relevant event handler.'
        }
      ]
    },
    {
      id: 'js_quiz_2',
      title: 'Advanced JavaScript',
      questions: [
        {
          id: 'js_adv_q1',
          text: 'What are Promises and how do they work?',
          answer: 'Promises are objects representing the eventual completion or failure of an asynchronous operation. They can be in one of three states: pending, fulfilled, or rejected. They help manage asynchronous operations more elegantly than callbacks.'
        },
        {
          id: 'js_adv_q2',
          text: 'Explain prototypal inheritance.',
          answer: 'Prototypal inheritance is a feature in JavaScript where an object can inherit properties and methods from another object. Each object has a private property which holds a link to another object called its prototype.'
        }
      ]
    }
  ],
  'react': [
    {
      id: 'react_quiz_1',
      title: 'React Fundamentals',
      questions: [
        {
          id: 'react_q1',
          text: 'What are React hooks?',
          answer: 'Hooks are functions that allow you to "hook into" React state and lifecycle features from function components. They let you use state and other React features without writing a class component.'
        },
        {
          id: 'react_q2',
          text: 'Explain the virtual DOM.',
          answer: 'The virtual DOM is a programming concept where an ideal, or "virtual", representation of a UI is kept in memory and synced with the "real" DOM by a library such as ReactDOM. This process is called reconciliation.'
        }
      ]
    },
    {
      id: 'react_quiz_2',
      title: 'React State Management',
      questions: [
        {
          id: 'react_state_q1',
          text: 'What is Redux and when should you use it?',
          answer: 'Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently and run in different environments. You might want to use Redux when you have complex state management needs or when multiple components need access to the same state.'
        },
        {
          id: 'react_state_q2',
          text: 'Compare useState and useReducer.',
          answer: 'useState is a Hook that lets you add React state to function components. useReducer is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.'
        }
      ]
    }
  ],
  'typescript': [
    {
      id: 'ts_quiz_1',
      title: 'TypeScript Basics',
      questions: [
        {
          id: 'ts_q1',
          text: 'What are the benefits of using TypeScript?',
          answer: 'TypeScript adds static typing to JavaScript, enabling better tooling, earlier error detection, and improved code maintainability. It also provides features like interfaces, enums, and generics.'
        },
        {
          id: 'ts_q2',
          text: 'Explain the difference between interface and type.',
          answer: 'While interfaces and types are similar, interfaces are primarily used to describe object shapes and can be extended. Types are more flexible and can represent unions, intersections, and other advanced types.'
        }
      ]
    }
  ]
};

interface QuizState {
  quizzes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  loading: false,
  error: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Quizzes
    builder
      .addCase(quizThunks.fetchQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(quizThunks.fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload || [];
        state.error = null;
      })
      .addCase(quizThunks.fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quizzes';
      });

    // Create Quiz
    builder
      .addCase(quizThunks.createQuiz.fulfilled, (state, action) => {
        state.quizzes.push(action.payload);
      });

    // Create Question
    builder
      .addCase(quizThunks.createQuestion.fulfilled, (state, action) => {
        const quiz = state.quizzes.find(q => q.id === action.payload.quizId);
        if (quiz) {
          quiz.questions.push(action.payload);
        }
      });

    // Update Question Answer
    builder
      .addCase(quizThunks.updateQuestionAnswer.fulfilled, (state, action) => {
        const quiz = state.quizzes.find(q => q.id === action.payload.quizId);
        if (quiz) {
          const question = quiz.questions.find(
            (q: any) => q.id === action.payload.questionId
          );
          if (question) {
            question.answer = action.payload.answer;
          }
        }
      });
  },
});

export default quizSlice.reducer;
