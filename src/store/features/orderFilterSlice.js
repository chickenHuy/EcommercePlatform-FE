import { createSlice } from "@reduxjs/toolkit";

export const orderFilter = createSlice({
  name: "orderSearch",
  initialState: {
    filterTab: "",
    filter: "",
    activeItem: "",
  },
  reducers: {
    setFilterTab: (state, action) => {
      state.filterTab = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setActiveItem: (state, action) => {
      state.activeItem = action.payload;
    },
  },
});

export const { setFilterTab, setFilter, setActiveItem } = orderFilter.actions;

export default orderFilter.reducer;
