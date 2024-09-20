import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: {
        username: '',
        password: '',
    },
    reducers: {
        changeUsername: (state, action) => {
            state.username = action.payload;
        },
        changePassword: (state, action) => {
            state.password = action.payload;
        },
    },
});

export const {changeUsername, changePassword} = loginSlice.actions;

export default loginSlice.reducer;