import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApiSlice } from "../services/userApi";
import { transactionApiSlice } from "../services/transactionApi";
import authReducer from "../services/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [transactionApiSlice.reducerPath]: transactionApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApiSlice.middleware,
      transactionApiSlice.middleware
    ),
});

setupListeners(store.dispatch);
