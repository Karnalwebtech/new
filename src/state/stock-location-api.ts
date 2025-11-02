import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import {
  GETResponseLocationFulFillmentProvider,
  GetResponseStockLocation,
  GETResponseStockLocationDetails,
  GETResponseStockLocationSaleChannel,
  StockLocationType,
} from "@/types/stock-location-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stockLocationApi = createApi({
  reducerPath: "stockLocationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["stockLocation","stockLocationSaleChannel","locationFulfillmentProvider"],
  endpoints: (build) => ({
    getAllStockLocation: build.query<
      GetResponseStockLocation,
      {
        type?: string;
        rowsPerPage?: number;
        page?: number;
        keywords?: string;
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
          url: "/stock-location",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "stockLocation", id: "LIST" }],
    }),
    addStockLocation: build.mutation<void, StockLocationType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/edit-stock-location",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "stockLocation", id: "LIST" }],
    }),
    updateStockLocation: build.mutation<void, StockLocationType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/stock-location-edit/${data?.id}`,
          method: "put",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "stockLocation", id: "LIST" }],
    }),
    deleteStockLocation: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/remove-stock-location/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "stockLocation", id: "LIST" }],
    }),
    getStockLocationDetails: build.query<
      GETResponseStockLocationDetails,
      { id: string }
    >({
      query: ({ id }) => {
        return {
          url: `/stock-location/${id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "stockLocation", id: "LIST" }],
    }),
    updateStockLocationSaleChannel: build.mutation<void, {id:string[],stock_location_id:string}>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/sale-channel-stock-location-edit",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "stockLocationSaleChannel", id: "LIST" }],
    }),
     getAllStockLocationSaleChannel: build.query<
      GETResponseStockLocationSaleChannel,
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
          if (filters.stock_location_id) {
            params.stock_location_id = filters.stock_location_id; // Convert number to string
          }
        }

        return {
          url: "/sale-channel-stock-location",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "stockLocationSaleChannel", id: "LIST" }],
    }),

     updateLocationFulfillmentProvider: build.mutation<void, {id:string[],stock_location_id:string}>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/location-fulfillment-provider-edit",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "locationFulfillmentProvider", id: "LIST" }],
    }),
     getAllLocationFulfillmentProvider: build.query<
      GETResponseLocationFulFillmentProvider,
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
          if (filters.stock_location_id) {
            params.stock_location_id = filters.stock_location_id; // Convert number to string
          }
        }

        return {
          url: "/location-fulfillment-provider",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "locationFulfillmentProvider", id: "LIST" }],
    }),
  }),
});
export const {
  useAddStockLocationMutation,
  useGetAllStockLocationQuery,
  useDeleteStockLocationMutation,
  useGetStockLocationDetailsQuery,
  useUpdateStockLocationMutation,
  useUpdateStockLocationSaleChannelMutation,
  useGetAllStockLocationSaleChannelQuery,
  useUpdateLocationFulfillmentProviderMutation,
  useGetAllLocationFulfillmentProviderQuery
} = stockLocationApi;
