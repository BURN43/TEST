// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userIdReducer from './userIdSlice'; // Import the userId slice reducer

const store = configureStore({
  reducer: {
    userId: userIdReducer,
  },
});

export default store;
