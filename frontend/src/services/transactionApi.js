import { apiSlice } from "../apiSlice";
import { BASE_URL } from "../../constant";

export const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation({
      query: (transaction) => ({
        url: `${BASE_URL}/api/transactions`,
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transaction"],
    }),
    getUserTransactions: builder.query({
      query: () => ({
        url: `${BASE_URL}/api/transactions/mytransactions`,
      }),
      providesTags: ["Transaction"],
    }),
    getAllTransactions: builder.query({
      query: () => ({
        url: `${BASE_URL}/api/transactions`,
      }),
      providesTags: ["Transaction"],
    }),
    updateTransactionStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${BASE_URL}/api/transactions/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Transaction"],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/api/transactions/${id}`,
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
} = transactionApiSlice;
