import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk'; // Use named import
import { composeWithDevTools } from 'redux-devtools-extension';
import userIdReducer from './reducers/userIdReducer'; // Make sure this reducer file exists

// Combine all reducers
const rootReducer = combineReducers({
  userId: userIdReducer,
  // Add other reducers here when needed
});

// Create the store with middleware
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)) // Apply Redux Thunk middleware for async actions
);

export default store;
