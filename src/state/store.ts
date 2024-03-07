import { combineSlices, configureStore } from "@reduxjs/toolkit";
import skillsReducer from '../slices/skillsSlice';
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore } from "redux-persist";

const persistConfig = {
  key: 'root',
  storage,
}

const reducer = combineSlices({
  skills: skillsReducer
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  devTools: true,
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});

export const persistor = persistStore(store);

type RootState = ReturnType<typeof store.getState>;

export default store;

export type AppDispatch = typeof store.dispatch;
export type { RootState };
