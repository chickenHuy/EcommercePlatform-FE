import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: null,
  mainCategoryId: null,
  brands: null,
  store: null,
  sortBy: "",
  order: "",
  minPrice: 0,
  maxPrice: 99999999,
  rating: 0,
  search: "",
};

const resetState = {
  categories: [],
  mainCategoryId: null,
  brands: [],
  sortBy: "",
  order: "",
  minPrice: 0,
  maxPrice: 99999999,
  rating: 0,
};
const userSearchSlice = createSlice({
  name: "userSearchSlice",
  initialState,
  reducers: {
    setMainCategoryId: (state, action) => {
      state.mainCategoryId = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setStore: (state, action) => {
      state.store = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setMinPrice: (state, action) => {
      state.minPrice = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    setRating: (state, action) => {
      state.rating = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    resetFilters: (state) => {
      Object.assign(state, resetState);
    },
  },
});

export const {
  setCategories,
  setBrands,
  setStore,
  setSortBy,
  setOrder,
  setMinPrice,
  setMaxPrice,
  setRating,
  setSearch,
  resetFilters,
  setMainCategoryId,
} = userSearchSlice.actions;

export default userSearchSlice.reducer;
