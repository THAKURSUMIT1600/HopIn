import { createSlice } from "@reduxjs/toolkit";
import {
  registerCaptain,
  loginCaptain,
  logoutCaptain,
  loadCaptainProfile,
  updateCaptainProfile,
} from "../services/Captain";
const initialState = {
  captain: null,
  error: null,
  loading: false,
};
export const captainSlice = createSlice({
  name: "captain",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerCaptain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCaptain.fulfilled, (state, action) => {
        state.loading = false;
        state.captain = action.payload;
      })
      .addCase(registerCaptain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });

    builder
      .addCase(loginCaptain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginCaptain.fulfilled, (state, action) => {
        state.loading = false;
        state.captain = action.payload;
      })
      .addCase(loginCaptain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });

    builder
      .addCase(logoutCaptain.fulfilled, (state, action) => {
        state.captain = action.payload || null;
        state.error = null;
        state.loading = false;
      })
      .addCase(logoutCaptain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });

    builder
      .addCase(loadCaptainProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCaptainProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.captain = action.payload;
      })
      .addCase(loadCaptainProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });

    builder
      .addCase(updateCaptainProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCaptainProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.captain = action.payload;
      })
      .addCase(updateCaptainProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export default captainSlice.reducer;
