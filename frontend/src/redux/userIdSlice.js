// src/redux/userIdSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const userIdSlice = createSlice({
  name: 'userId',
  initialState: {
    userId: null,
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    clearUserId: (state) => {
      state.userId = null;
    },
  },
});

export const { setUserId, clearUserId } = userIdSlice.actions;

export default userIdSlice.reducer;
