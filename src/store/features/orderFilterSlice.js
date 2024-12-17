import { createSlice } from "@reduxjs/toolkit";

export const orderFilter = createSlice({
  name: "orderSearch",
  initialState: {
    filter: "",
    showFilter: true,
    activeItem: "",
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setShowFilter: (state, action) => {
      state.showFilter = action.payload;
    },
    setActiveItem: (state, action) => {
      state.activeItem = action.payload;
    },
  },
});

export const { setFilter, setShowFilter, setActiveItem } = orderFilter.actions;

export default orderFilter.reducer;
