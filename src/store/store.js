import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./features/loginSlice";
import componentSlice from "./features/componentSlice";
import brandSlice from "./features/brandSlice";
import searchSlice from "./features/searchSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      loginReducer: loginSlice,
      componentReducer: componentSlice,
      brandReducer: brandSlice,
      searchReducer: searchSlice,
    },
  });
};
