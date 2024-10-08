import { createSlice } from "@reduxjs/toolkit";

const componentSlice = createSlice({
  name: "componentSlice",
  initialState: {
    name: '',
    required: true,
  },
  reducers: {
    changeName: (state, action) => {
      state.name = action.payload;
    },
    changeRequired: (state, action) => {
      state.required = action.payload;
    },
  },
});

export const { changeName, changeRequired } = componentSlice.actions;

export default componentSlice.reducer;
