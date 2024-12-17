import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    count: 0
  },
  reducers: {
    changeQuantity: (state, action) => {
      state.count = action.payload;
    }
  }
});

export const { changeQuantity } = cartSlice.actions;
export default cartSlice.reducer;