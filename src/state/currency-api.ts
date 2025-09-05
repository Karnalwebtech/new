import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { CurrencyItem, GetAllCurrenciesResponse } from "@/types/currency-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const currencyApi = createApi({
  reducerPath: "currencyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["currencyApi"],
  endpoints: (build) => ({
    EditCurrency: build.mutation<void, CurrencyItem[]>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/currency-edit",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "currencyApi", id: "LIST" }],
    }),
    getAllCurrencies: build.query<
      GetAllCurrenciesResponse,
      {
        rowsPerPage?: number;
        page?: number;
        keywords?: string;
      } | void
    >({
      query: (filters) => {
        const params: Record<string, string | number | boolean> = {};
        if (filters) {
          if (filters.rowsPerPage) {
            params.rowsPerPage = filters.rowsPerPage; // Convert number to string
          }
          if (filters.page) {
            params.page = filters.page; // Convert number to string
          }
          if (filters.keywords) {
            params.keyword = filters.keywords; // Convert number to string
          }
        }

        return {
          url: "/currencies",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "currencyApi", id: "LIST" }],
    }),
  }),
});
export const { useEditCurrencyMutation, useGetAllCurrenciesQuery } =
  currencyApi;
