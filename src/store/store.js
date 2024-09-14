import { configureStore } from '@reduxjs/toolkit';
import exampleSlice from './features/exampleSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      exampleReducer: exampleSlice,
    },
  });
};
