import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.userInfo?.token; // Safely access token
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log("Token sent:", token); // Debug log
      } else {
        console.log("No token found in Redux state"); // Debug log
      }
      return headers;
    },
  }),
  tagTypes: ["Transaction"],
  endpoints: () => ({}),
});

export const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation({
      query: (transaction) => ({
        url: `/api/transactions`,
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transaction"],
    }),
    getUserTransactions: builder.query({
      query: () => ({
        url: `/api/transactions/mytransactions`,
      }),
      providesTags: ["Transaction"],
    }),
    getAllTransactions: builder.query({
      query: () => ({
        url: `/api/transactions`,
      }),
      providesTags: ["Transaction"],
    }),
    updateTransactionStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/transactions/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Transaction"],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/api/transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaction"],
    }),
  }),
});

export const {
  useCreateTransactionMutation,
  useGetUserTransactionsQuery,
  useGetAllTransactionsQuery,
  useUpdateTransactionStatusMutation,
  useDeleteTransactionMutation,
} = transactionApi;
