import { AnyAction, configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import notesReducer from "../slices/notesSlice";
import skillsReducer from "../slices/skillsSlice";
import pageReducer from "../slices/pageSlice";
import referenceReducer from "../slices/referenceSlice";
import storageSession from "redux-persist/lib/storage/session";
import quizReducer from "../slices/quizSlice";
import quizResultsReducer from "../slices/quizResultsSlice";
import thunk, { ThunkDispatch } from 'redux-thunk';

// Persist configuration
const persistConfig = {
  key: "root",
  storage: storageSession,
};

// Combined reducer before persisting
const rootReducer = combineReducers({
  notes: notesReducer,
  skills: skillsReducer,
  page: pageReducer,
  reference: referenceReducer,
  quiz: quizReducer,
  quizResults: quizResultsReducer,
});

// Define the RootState type to represent the overall shape of your Redux store state
type RootState = ReturnType<typeof rootReducer>;

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PERSIST",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).prepend(thunk),
});

// Create the persistor
const persistor = persistStore(store);

// Export the store and persistor
export { store, persistor };
// Export types
export type { RootState };
// Export the AppDispatch type for use with useDispatch
export type AppDispatch = typeof store.dispatch & ThunkDispatch<RootState, null, AnyAction>;
