import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import {
  GetResponseAllInventory,
  GetResponseInventoryDetails,
  InventoryType,
} from "@/types/inventory-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const inventoryApi = createApi({
  reducerPath: "inventoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["inventory"],
  endpoints: (build) => ({
    addInventory: build.mutation<void, InventoryType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/add-inventory",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "inventory", id: "LIST" }],
    }),
    updateInventory: build.mutation<void, InventoryType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/update-inventory/${data.id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "inventory", id: "LIST" }],
    }),
    getAllInventory: build.query<
      GetResponseAllInventory,
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
          url: "/all-inventories",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "inventory", id: "LIST" }],
    }),
    getInventoryDetails: build.query<
      GetResponseInventoryDetails,
      {
        rowsPerPage?: number;
        page?: number;
        keywords?: string;
        id: string;
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
          url: `/inventories-details/${filters?.id}`,
          params,
          method: "GET",
        };
      },
      providesTags: [{ type: "inventory", id: "LIST" }],
    }),
    removeInventory: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/delete-inventory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "inventory", id: "LIST" }],
    }),
  }),
});
export const {
  useAddInventoryMutation,
  useGetAllInventoryQuery,
  useRemoveInventoryMutation,
  useGetInventoryDetailsQuery,
  useUpdateInventoryMutation,
} = inventoryApi;
