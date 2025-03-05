import { apiSlice } from "../apiSlice";
import { BASE_URL } from "../../constant";

export const transactionApi = apiSlice.injectEndpoints({
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
      query: ({ page = 1, limit = 10, startDate, endDate, search } = {}) => ({
        url: `${BASE_URL}/api/transactions/mytransactions`,
        params: { page, limit, startDate, endDate, search },
      }),
      providesTags: ["Transaction"],
    }),
    getAllTransactions: builder.query({
      query: ({ page = 1, limit = 10, startDate, endDate, search } = {}) => ({
        url: `${BASE_URL}/api/transactions`,
        params: { page, limit, startDate, endDate, search },
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
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getUserTransactions",
            undefined,
            (draft) => {
              const transaction = draft.transactions.find((t) => t._id === id);
              if (transaction) transaction.status = status;
            }
          )
        );
        const patchAllResult = dispatch(
          apiSlice.util.updateQueryData(
            "getAllTransactions",
            undefined,
            (draft) => {
              const transaction = draft.transactions.find((t) => t._id === id);
              if (transaction) transaction.status = status;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          patchAllResult.undo();
        }
      },
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
} = transactionApi;
