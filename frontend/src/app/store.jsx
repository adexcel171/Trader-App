// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { transactionApi } from "../services/transactionApi"; // From your previous code
import { cryptoApi } from "../services/cryptoApi"; // Import your cryptoApi (adjust path if needed)
import authReducer from "../services/authSlice"; // Assuming you have an auth reducer

export const store = configureStore({
  reducer: {
    // Add reducers for all RTK Query APIs
    [transactionApi.reducerPath]: transactionApi.reducer,
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    auth: authReducer, // Your existing auth reducer
  },
  // Add middleware for all RTK Query APIs
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      transactionApi.middleware,
      cryptoApi.middleware,
    ]),
});

// Optional: Set up listeners for refetching and other RTK Query behaviors
setupListeners(store.dispatch);

export default store;
