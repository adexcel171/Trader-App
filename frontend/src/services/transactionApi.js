import { apiSlice } from "../apiSlice";
import { BASE_URL } from "../../constant";

// Export as `transactionApi`
export const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation({
      query: (transaction) => ({
        url: `${BASE_URL}/api/transactions`,
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transaction"], // Refetch transactions after creation
    }),
    getUserTransactions: builder.query({
      query: () => ({
        url: `${BASE_URL}/api/transactions/mytransactions`,
      }),
      providesTags: ["Transaction"], // Cache user-specific transactions
    }),
    getAllTransactions: builder.query({
      query: () => ({
        url: `${BASE_URL}/api/transactions`,
      }),
      providesTags: ["Transaction"], // Cache all transactions (admin-only)
    }),
    updateTransactionStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${BASE_URL}/api/transactions/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Transaction"], // Refetch transactions after status update
      // Optional: Optimistic update to improve UX (if needed)
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getUserTransactions",
            undefined,
            (draft) => {
              const transaction = draft.find((t) => t._id === id);
              if (transaction) transaction.status = status;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/api/transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaction"], // Refetch transactions after deletion
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
