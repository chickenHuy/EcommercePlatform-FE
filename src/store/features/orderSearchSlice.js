import { createSlice } from "@reduxjs/toolkit";

export const orderSearchSlice = createSlice({
  name: "orderSearch",
  initialState: {
    value: "",
    showFilter: true,
  },
  reducers: {
    setSearch: (state, action) => {
      state.value = action.payload;
    },
    setShowFilter: (state, action) => {
      state.showFilter = action.payload;
    },
  },
});

export const { setSearch, setShowFilter } = orderSearchSlice.actions;

export default orderSearchSlice.reducer;
