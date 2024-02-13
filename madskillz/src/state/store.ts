import { configureStore } from "@reduxjs/toolkit";
import counterReducer from '../slices/counterSlice';
import notesReducer from '../slices/notesSlice';
import skillsReducer from '../slices/skillsSlice';

// Define the RootState type to represent the overall shape of your Redux store state
type RootState = ReturnType<typeof store.getState>;

const store = configureStore({
  reducer: {
    counter: counterReducer,
    notes: notesReducer,
    skills: skillsReducer
    // Add more slices/reducers as needed
  },
});

export default store;

// Export the RootState type for use in your components
export type { RootState };
