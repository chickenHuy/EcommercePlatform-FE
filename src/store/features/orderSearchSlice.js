import { createSlice } from "@reduxjs/toolkit";

export const orderSearchSlice = createSlice({
  name: "orderSearch",
  initialState: {
    value: "",
    showFilter: true,
    activeItem: "",
    currentPage: 1,
    totalPage: 1,
  },
  reducers: {
    setSearch: (state, action) => {
      state.value = action.payload;
    },
    setFilter: (state, action) => {
      state.value = action.payload;
    },
    setShowFilter: (state, action) => {
      state.showFilter = action.payload;
    },
    setActiveItem: (state, action) => {
      state.activeItem = action.payload;
    },
  },
});

export const {
  setSearch,
  setFilter,
  setShowFilter,
  setActiveItem,
} = orderSearchSlice.actions;

export default orderSearchSlice.reducer;
