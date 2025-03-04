// src/services/cryptoApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../constant.js";

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include", // Ensure cookies are sent with requests
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
