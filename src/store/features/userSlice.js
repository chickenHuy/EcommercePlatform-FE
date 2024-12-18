import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'userSlice',
    initialState: {
       user: null
    },
    reducers: {
        changeUser: (state, action) => {
            state.user = action.payload;
        },
        changeQuantity: (state, action) => {
            state.user.cartItemCount = action.payload;
        },
    },
});

export const {changeUser, changeQuantity} = userSlice.actions;

export default userSlice.reducer;