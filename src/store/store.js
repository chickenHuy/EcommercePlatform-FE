import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './features/loginSlice';
import componentSlice from './features/componentSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      loginReducer: loginSlice,
      componentReducer: componentSlice,
    },
  });
};
