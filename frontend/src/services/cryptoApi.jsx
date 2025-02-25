import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://trader-xewp.onrender.com//api",
  }),
  tagTypes: ["Crypto"],
  endpoints: (builder) => ({
    getCryptos: builder.query({
      query: () => "cryptos",
      providesTags: ["Crypto"],
    }),
    addCrypto: builder.mutation({
      query: (crypto) => ({
        url: "cryptos",
        method: "POST",
        body: crypto,
      }),
      invalidatesTags: ["Crypto"],
    }),
    updateCrypto: builder.mutation({
      query: ({ id, ...crypto }) => ({
        url: `cryptos/${id}`,
        method: "PUT",
        body: crypto,
      }),
      invalidatesTags: ["Crypto"],
    }),
    deleteCrypto: builder.mutation({
      query: (id) => ({
        url: `cryptos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Crypto"],
    }),
  }),
});

export const {
  useGetCryptosQuery,
  useAddCryptoMutation,
  useUpdateCryptoMutation,
  useDeleteCryptoMutation,
} = cryptoApi;
