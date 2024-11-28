import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    count: 0
  },
  reducers: {
    setQuantity: (state, action) => {
      state.count = action.payload;
    }
  }
});

export const { setQuantity } = cartSlice.actions;
export default cartSlice.reducer;