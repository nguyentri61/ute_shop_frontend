import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './features/auth/loginSlice';
import registerReducer from './features/auth/registerSlice';
import otpReducer from './features/auth/otpSlice';
import productReducer from './features/products/productSlice';
import forgotPasswordReducer from './features/auth/forgotPasswordSlice';
import categoryReducer from './features/products/categorySlice';
import profileReducer from './features/auth/profileSlice';
import cartReducer from './features/order/cartSlice';
import adminOrderReducer from './features/admin/adminOrderSlice';
import couponsReducer from './features/products/couponSlice';
import favoriteReducer from './features/products/favoriteSlice';
import recentlyViewedReducer from './features/products/recentlyViewedSlice';
import similarProductsReducer from './features/products/similarProductsSlice';


export const store = configureStore({
    reducer: {
        login: loginReducer,
        register: registerReducer,
        product: productReducer,
        category: categoryReducer,
        otp: otpReducer,
        forgotPassword: forgotPasswordReducer,
        profile: profileReducer,
        cart: cartReducer,
        adminOrder: adminOrderReducer,
        coupons: couponsReducer,
        favorite: favoriteReducer,
        recentlyViewed: recentlyViewedReducer,
        similarProducts: similarProductsReducer,
    },
});
