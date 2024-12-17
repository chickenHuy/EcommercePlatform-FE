import { createSlice } from "@reduxjs/toolkit";

const brandSlice = createSlice({
  name: "brandSlice",
  initialState: {
    name: "",
    description: "",
  },
  reducers: {
    changeName: (state, action) => {
      state.name = action.payload;
    },
    changeDescription: (state, action) => {
      state.description = action.payload;
    },
  },
});

export const { changeName, changeDescription } = brandSlice.actions;

export default brandSlice.reducer;
