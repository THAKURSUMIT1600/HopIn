import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/User";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import captainReducer from "../features/Captain";

export const persistConfig = {
  key: "root",
  storage,
};
export const rootReducer = combineReducers({
  user: userReducer,
  captain: captainReducer,
});
export const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});
export const persistor = persistStore(store);
