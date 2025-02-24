import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../services/authSlice"; // ✅ User authentication state
import { apiSlice } from "../apiSlice"; // ✅ API services
import { cryptoApi } from "../services/cryptoApi"; // ✅ Crypto API service

export const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ Handles authentication state (userInfo)
    [apiSlice.reducerPath]: apiSlice.reducer, // ✅ Handles API calls
    [cryptoApi.reducerPath]: cryptoApi.reducer, // ✅ Handles Crypto API calls
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, cryptoApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});
