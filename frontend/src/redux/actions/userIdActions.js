export const setUserId = (userId) => {
    return {
      type: 'SET_USER_ID',
      payload: userId,
    };
  };
  
  export const clearUserId = () => {
    return {
      type: 'CLEAR_USER_ID',
    };
  };
  