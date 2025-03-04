// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../services/authSlice";
// import transactionsReducer from "../services/tansactionSlice"; // Add this line
import { apiSlice } from "../apiSlice";
import { cryptoApi } from "../services/cryptoApi";
import { transactionApi } from "../services/transactionApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // transactions: transactionsReducer, // Add this line
    [apiSlice.reducerPath]: apiSlice.reducer,
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, cryptoApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});
