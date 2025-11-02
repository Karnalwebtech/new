import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GETResponseFulFillmentProvider } from "@/types/fulfillment-provider-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fulfillmentProviderApi = createApi({
  reducerPath: "fulfillmentProviderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["fulfillment"],
  endpoints: (build) => ({
    getAllFulFillmentProvider: build.query<
      GETResponseFulFillmentProvider,
      {
        type?: string;
        rowsPerPage?: number;
        page?: number;
        keywords?: string;
           stock_location_id?: string;
      } | void
    >({
      query: (filters) => {
        const params: Record<string, string | number | boolean> = {};
        // Add filters to the query parameters if they are present
        if (filters) {
          if (filters.rowsPerPage) {
            params.rowsPerPage = filters.rowsPerPage; // Convert number to string
          }
          if (filters.page) {
            params.page = filters.page; // Convert number to string
          }
          if (filters.keywords) {
            params.keywords = filters.keywords; // Convert number to string
          }
        }

        return {
          url: "/all-fulfillment-provider",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "fulfillment", id: "LIST" }],
    }),
  }),
});
export const { useGetAllFulFillmentProviderQuery } = fulfillmentProviderApi;
