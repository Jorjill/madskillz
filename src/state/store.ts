import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import notesReducer from "../slices/notesSlice";
import skillsReducer from "../slices/skillsSlice";
import pageReducer from "../slices/pageSlice";
import storageSession from "redux-persist/lib/storage/session";

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
});

// Enhanced reducer with persistence capabilities
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
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
    }),
});

// Create a persistor instance
const persistor = persistStore(store);

// Define the RootState type to represent the overall shape of your Redux store state
type RootState = ReturnType<typeof store.getState>;

// Export the store and persistor
export { store, persistor };

// Export the RootState type for use in your components
export type { RootState };
