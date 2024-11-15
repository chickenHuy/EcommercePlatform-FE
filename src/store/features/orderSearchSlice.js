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
    setShowFilter: (state, action) => {
      state.showFilter = action.payload;
    },
    setActiveItem: (state, action) => {
      state.activeItem = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPage: (state, action) => {
      state.totalPage = action.payload;
    },
  },
});

export const {
  setSearch,
  setShowFilter,
  setActiveItem,
  setCurrentPage,
  setTotalPage,
} = orderSearchSlice.actions;

export default orderSearchSlice.reducer;
