import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Set user data after successful login or signup
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user || {};
      state.token = token || null;
      state.isAuthenticated = true;
    },

    // ✅ Log out and clear all authentication info
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    // ✅ Restore user session (if token exists)
    restoreSession: (state, action) => {
      const { user, token } = action.payload || {};
      if (token) {
        state.isAuthenticated = true;
        state.user = user || {};
        state.token = token;
      }
    },
  },
});

export const { setUser, logOut, restoreSession } = authSlice.actions;
export default authSlice.reducer;
