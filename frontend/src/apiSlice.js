import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constant";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include", // Include credentials with every request
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Category"],
  endpoints: () => ({}), // To be extended by other slices
});
