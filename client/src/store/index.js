import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.js";

// ✅ Optional: Persist auth state (to maintain login after refresh)
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("expense-tracker-state", serializedState);
  } catch (error) {
    console.error("Error saving state:", error);
  }
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("expense-tracker-state");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Error loading state:", error);
    return undefined;
  }
};

const persistedState = loadState();

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: persistedState, // ✅ Loads saved state if available
});

// ✅ Automatically save store changes to localStorage
store.subscribe(() => {
  saveState({
    auth: store.getState().auth,
  });
});

export default store;
