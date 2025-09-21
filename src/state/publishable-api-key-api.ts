import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GetResponsePublishableApiKey, PublishableApiKeyType } from "@/types/publishable-api-key-sales-channel-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publishableApiKeyApi = createApi({
  reducerPath: "publishableApiKeyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["publishableApiKeyApi"],
  endpoints: (build) => ({
    getAllPublisgableApiKeys: build.query<
      GetResponsePublishableApiKey,
      {
        type?: string;
        rowsPerPage?: number;
        page?: number;
        keywords?: string;
        publishable_api_key_id?: string;
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
          if (filters.publishable_api_key_id) {
            params.publishable_api_key_id = filters.publishable_api_key_id; // Convert number to string
          }
          if (filters.keywords) {
            params.keywords = filters.keywords; // Convert number to string
          }
        }

        return {
          url: "/publishable-api-key-sales-channels",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "publishableApiKeyApi", id: "LIST" }],
    }),
    addPublishableApiKey: build.mutation<void, PublishableApiKeyType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/create-publishable_api_key_sales_channel",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "publishableApiKeyApi", id: "LIST" }],
    }),
    deletePublishableApiKey: build.mutation<void, { ids: string[] }>({
      query: ({ids}) => ({
        url: `/delete-publishable-api-key-sales-channels`,
        method: "DELETE", // Use DELETE instead of PUT
        body: { ids },
      }),
      invalidatesTags: [{ type: "publishableApiKeyApi", id: "LIST" }],
    }),
  }),
});
export const {
  useAddPublishableApiKeyMutation,
  useGetAllPublisgableApiKeysQuery,
  useDeletePublishableApiKeyMutation,
} = publishableApiKeyApi;
