import { createSlice } from "@reduxjs/toolkit";

export const orderSearchSlice = createSlice({
  name: "orderSearch",
  initialState: {
    value: "",
  },
  reducers: {
    setSearch: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setSearch } = orderSearchSlice.actions;

export default orderSearchSlice.reducer;
