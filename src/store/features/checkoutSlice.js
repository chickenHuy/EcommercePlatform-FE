import { createSlice } from '@reduxjs/toolkit';

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    stores: []
  },
  reducers: {
    setCheckout: (state, action) => {
      state.stores = action.payload;
    }
  }
});

export const { setCheckout} = checkoutSlice.actions;
export default checkoutSlice.reducer;