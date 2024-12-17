import { createSlice } from "@reduxjs/toolkit";

const wishSlice = createSlice({
  name: "wishSlice",
  initialState: {
    wishList: [],
  },
  reducers: {
    setWishList: (state, action) => {
      state.wishList = action.payload;
    },
  },
});

export const { setWishList } = wishSlice.actions;

export default wishSlice.reducer;
