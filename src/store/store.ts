// store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice'; // Assuming you have a rootReducer

const rootReducer = combineReducers({
  auth: authReducer,
});

const store = configureStore({
  reducer: rootReducer, // Pass your root reducer here
  // Optional: Add middleware, preloadedState, or devTools configuration
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(myCustomMiddleware),
  // devTools: process.env.NODE_ENV !== 'production',
});

export default store;