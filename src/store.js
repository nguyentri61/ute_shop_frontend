import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './features/auth/loginSlice';
import registerReducer from './features/auth/registerSlice';
import otpReducer from './features/auth/otpSlice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        register: registerReducer,
        otp: otpReducer
    },
});
