import {configureStore} from '@reduxjs/toolkit';
import authReducer from './Reducers/AuthReducer';

// Sets up the Redux store using the configureStore function.
export const store = configureStore({
    reducer: {
        authReducer,
    },
});