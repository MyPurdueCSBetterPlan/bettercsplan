import {createSlice} from '@reduxjs/toolkit';

// Define the initial state for the authentication slice
const initialState = {
    user: null,
}

// Create the authentication slice using createSlice function
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            // Update the user and token properties of the state based on the action payload
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
    },
});

// Export the setUser action creator
export const {
    setUser,
} = authSlice.actions;

export default authSlice.reducer;