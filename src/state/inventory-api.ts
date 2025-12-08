import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { InventoryType } from "@/types/inventory-type";
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
    // getAllFulFillmentSet: build.query<
    //   GETResponseLocationFulFillmentSet,
    //   {
    //     rowsPerPage?: number;
    //     page?: number;
    //     keywords?: string;
    //     stock_location_id?: string;
    //   } | void
    // >({
    //   query: (filters) => {
    //     const params: Record<string, string | number | boolean> = {};
    //     // Add filters to the query parameters if they are present
    //     if (filters) {
    //       if (filters.rowsPerPage) {
    //         params.rowsPerPage = filters.rowsPerPage; // Convert number to string
    //       }
    //       if (filters.page) {
    //         params.page = filters.page; // Convert number to string
    //       }
    //       if (filters.keywords) {
    //         params.keywords = filters.keywords; // Convert number to string
    //       }
    //       if (filters.stock_location_id) {
    //         params.stock_location_id = filters.stock_location_id; // Convert number to string
    //       }
    //     }

    //     return {
    //       url: "/fulfillment-set",
    //       params, // Use the dynamically constructed params
    //       method: "GET",
    //     };
    //   },
    //   providesTags: [{ type: "inventory", id: "LIST" }],
    // }),
    // removeFulFillmentSet: build.mutation<void, { id: string }>({
    //   query: ({ id }) => ({
    //     url: `/delete-fulfillment-set/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: [{ type: "inventory", id: "LIST" }],
    // }),
  }),
});
export const {
  useAddInventoryMutation,
  // useGetAllFulFillmentSetQuery,
  // useRemoveFulFillmentSetMutation,
} = inventoryApi;
