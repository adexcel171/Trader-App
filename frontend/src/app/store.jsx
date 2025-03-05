import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../services/authSlice"; // Adjust path to your authSlice
import { userApi } from "../services/userApi"; // Correct import

import { cryptoApi } from "../services/cryptoApi"; // Adjust path
import { transactionApi } from "../services/transactionApi"; // Adjust path

export const store = configureStore({
  reducer: {
    auth: authReducer, // Ensure this matches your authSlice export
    [userApi.reducerPath]: userApi.reducer, // RTK Query reducer for userApi
    [cryptoApi.reducerPath]: cryptoApi.reducer, // RTK Query reducer for cryptoApi
    [transactionApi.reducerPath]: transactionApi.reducer, // RTK Query reducer for transactionApi
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      cryptoApi.middleware,
      transactionApi.middleware
    ),
});
