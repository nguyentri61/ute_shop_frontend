import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './features/auth/loginSlice';
import registerReducer from './features/auth/registerSlice';
import otpReducer from './features/auth/otpSlice';
import forgotPasswordReducer from './features/auth/forgotPasswordSlice';
import profileReducer from './features/auth/profileSlice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        register: registerReducer,
        otp: otpReducer,
        forgotPassword: forgotPasswordReducer,
        profile: profileReducer,
    },
});
