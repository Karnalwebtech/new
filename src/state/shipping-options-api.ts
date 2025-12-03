import { apiKey, apiUrl } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "@/lib/set-localstorage";
import { GetAllResponseShippingOptions } from "@/types/shipping-options-type copy";

export const shippingOptionsApi = createApi({
  reducerPath: "shippingOptionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: async (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["shippingOptions"],
  endpoints: (build) => ({
    addShippingOptions: build.mutation<void, { data: string }>({
      query: (data) => {
        return {
          url: "/add-shipping-option",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [{ type: "shippingOptions", id: "LIST" }],
    }),
    getAllShippingOptions: build.query<
      GetAllResponseShippingOptions,
      {
        type?: string;
        rowsPerPage?: number;
        page?: number;
        keywords?: string;
        is_return?: string | boolean;
        service_zone_id?: string;
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
          if (filters.is_return) {
            params.is_return = filters.is_return; // Convert number to string
          }
           if (filters.service_zone_id) {
            params.service_zone_id = filters.service_zone_id; // Convert number to string
          }
        }

        return {
          url: "/shipping-options",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "shippingOptions", id: "LIST" }],
    }),
  }),
});
export const { useAddShippingOptionsMutation, useGetAllShippingOptionsQuery } =
  shippingOptionsApi;
