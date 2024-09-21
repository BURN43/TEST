// src/redux/actions/userIdActions.js
export const setUserId = (userId) => ({
  type: 'SET_USER_ID',
  payload: userId,
});

export const clearUserId = () => ({
  type: 'CLEAR_USER_ID',
});
