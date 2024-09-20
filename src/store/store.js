import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './features/loginSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      loginReducer: loginSlice,
    },
  });
};
