// src/services/transactionApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/transactions", // Ensure this matches your backend API base URL
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token;
      console.log("Token in prepareHeaders:", token); // Debugging
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include", // Include if using cookies for authentication
  }),
  tagTypes: ["Transaction"],
  endpoints: (builder) => ({
    // Create a new transaction
    createTransaction: builder.mutation({
      query: (transaction) => ({
        url: "", // Changed from "/" to "" to correctly append to baseUrl (/api/transactions)
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transaction"],
      transformErrorResponse: (response, meta, arg) => {
        console.error("Error creating transaction:", response);
        return response.data?.message || "Failed to create transaction";
      },
    }),

    // Get transactions for the authenticated user
    getUserTransactions: builder.query({
      query: () => "/mytransactions",
      providesTags: ["Transaction"],
      transformErrorResponse: (response) => {
        console.error("Error fetching user transactions:", response);
        return response.data?.message || "Failed to fetch user transactions";
      },
    }),

    // Get all transactions (admin only)
    getAllTransactions: builder.query({
      query: () => "",
      providesTags: ["Transaction"],
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
      invalidatesTags: ["Transaction"],
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
