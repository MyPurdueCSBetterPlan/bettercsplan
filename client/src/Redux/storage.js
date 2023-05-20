import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Reducers/AuthReducer';

export const store = configureStore({
    reducer: {
        authReducer,
    },
});