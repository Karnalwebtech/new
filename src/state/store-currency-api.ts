import { apiKey, apiUrl } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GetAllResponseStoreCurrencies } from "@/types/store-currincies-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AddCurrencyPayload {
  currencies: string[];
  tax: Record<string, boolean>;
}

export const storecurrencyApi = createApi({
  reducerPath: "storecurrencyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = getToken("token");
      if (apiKey) headers.set("x-api-key", apiKey);
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Storecurrency"],
  endpoints: (builder) => ({
    addCurrency: builder.mutation<void, AddCurrencyPayload>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        return {
          url: "/add-store-currency",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Storecurrency", id: "LIST" }],
    }),
    getAllStoreCurrencies: builder.query<
          GetAllResponseStoreCurrencies,
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
              url: "/store-currencies",
              params, // Use the dynamically constructed params
              method: "GET",
            };
          },
          providesTags: [{ type: "Storecurrency", id: "LIST" }],
        }),
  }),
});

export const { useAddCurrencyMutation,useGetAllStoreCurrenciesQuery } = storecurrencyApi;
