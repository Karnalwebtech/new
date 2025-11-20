import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import {
  FulFillmentSetType,
  GETResponseLocationFulFillmentSet,
} from "@/types/fulfillment-set-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fulfillmentSetApi = createApi({
  reducerPath: "fulfillmentSetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["fulfillment_set"],
  endpoints: (build) => ({
    addFulfillmentSet: build.mutation<void, FulFillmentSetType>({
      query: (data) => ({
        url: "/add-fulfillment-set",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "fulfillment_set", id: "LIST" }],
    }),
    getAllFulFillmentSet: build.query<
      GETResponseLocationFulFillmentSet,
      {
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
          if (filters.stock_location_id) {
            params.stock_location_id = filters.stock_location_id; // Convert number to string
          }
        }

        return {
          url: "/fulfillment-set",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "fulfillment_set", id: "LIST" }],
    }),
  }),
});
export const { useAddFulfillmentSetMutation, useGetAllFulFillmentSetQuery } =
  fulfillmentSetApi;
