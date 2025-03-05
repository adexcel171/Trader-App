import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApiSlice } from "../services/userApi";
import { transactionApiSlice } from "../services/transactionApi";
import { cryptoApi, useAddCryptoMutation } from "../services/cryptoApi";
import authReducer from "../services/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [transactionApiSlice.reducerPath]: transactionApiSlice.reducer,
    [cryptoApi.reducerPath]: cryptoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApiSlice.middleware,
      cryptoApi.middleware,
      transactionApiSlice.middleware
    ),
});

setupListeners(store.dispatch);
