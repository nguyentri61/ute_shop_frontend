import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './features/auth/loginSlice';
import registerReducer from './features/auth/registerSlice';
import otpReducer from './features/auth/otpSlice';
import productReducer from './features/products/productSlice';
import categoryReducer from './features/products/categorySlice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        register: registerReducer,
        otp: otpReducer,
        product: productReducer,
        category: categoryReducer
    },
});
