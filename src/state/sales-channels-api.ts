import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GetResponseSalesChannels, GetResponseSalesChannelsDetails, SalesChannelsType } from "@/types/sales-channels-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const salesChannelApi = createApi({
  reducerPath: "salesChannelApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["salesChannelApi"],
  endpoints: (build) => ({
    getAllSalesChannelsData: build.query<
      GetResponseSalesChannels,
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
          url: "/sales-channels",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "salesChannelApi", id: "LIST" }],
    }),
    addSalesChannels: build.mutation<void, SalesChannelsType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/sales-channel-edit",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "salesChannelApi", id: "LIST" }],
    }),
      updateSalesChannels: build.mutation<void, SalesChannelsType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/sales-channel-edit/${data?.id}`,
          method: "put",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "salesChannelApi", id: "LIST" }],
    }),
    deleteSalesChannels: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/sales-channel-delete/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "salesChannelApi", id: "LIST" }],
    }),
    getSalesChannelsDetails: build.query<GetResponseSalesChannelsDetails, { id: string }>({
      query: ({id}) => {
        return {
          url: `/sales-channel/${id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "salesChannelApi", id: "LIST" }],
    }),
  }),
});
export const { useAddSalesChannelsMutation,useGetAllSalesChannelsDataQuery,useDeleteSalesChannelsMutation,useGetSalesChannelsDetailsQuery,useUpdateSalesChannelsMutation } = salesChannelApi;
