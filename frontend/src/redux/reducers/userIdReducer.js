// src/redux/reducers/userIdReducer.js
const initialState = {
  userId: null,
};

const userIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_ID':
      return {
        ...state,
        userId: action.payload,
      };
    case 'CLEAR_USER_ID':
      return {
        ...state,
        userId: null,
      };
    default:
      return state;
  }
};

export default userIdReducer;
