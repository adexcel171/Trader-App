// src/services/transactionApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/transactions", // Use full URL in production (e.g., "https://api.example.com/api/transactions")
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token;
      console.log("Token in prepareHeaders:", token); // Debugging: Log the token
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include", // Only include if using cookies for authentication
  }),
  tagTypes: ["Transaction"],
  endpoints: (builder) => ({
    // Create a new transaction
    createTransaction: builder.mutation({
      query: (transaction) => ({
        url: "/",
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transaction"], // Invalidate cache for Transaction
      transformErrorResponse: (response) => {
        console.error("Error creating transaction:", response);
        return response.data?.message || "Failed to create transaction";
      },
    }),

    // Get transactions for the authenticated user
    getUserTransactions: builder.query({
      query: () => "/mytransactions",
      providesTags: ["Transaction"], // Cache tag for Transaction
      transformErrorResponse: (response) => {
        console.error("Error fetching user transactions:", response);
        return response.data?.message || "Failed to fetch user transactions";
      },
    }),

    // Get all transactions (admin only)
    getAllTransactions: builder.query({
      query: () => "/",
      providesTags: ["Transaction"], // Cache tag for Transaction
      transformErrorResponse: (response) => {
        console.error("Error fetching all transactions:", response);
        return response.data?.message || "Failed to fetch all transactions";
      },
    }),

    // Update transaction status
    updateTransactionStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Transaction"], // Invalidate cache for Transaction
      transformErrorResponse: (response) => {
        console.error("Error updating transaction status:", response);
        return response.data?.message || "Failed to update transaction status";
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateTransactionMutation,
  useGetUserTransactionsQuery,
  useGetAllTransactionsQuery,
  useUpdateTransactionStatusMutation,
} = transactionApi;
