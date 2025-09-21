import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { ApiKeyType, GetResponseApiKey, GetResponseApiKeyDetails } from "@/types/api-key-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiKeyApi = createApi({
  reducerPath: "apiKeyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["apiKeyApi"],
  endpoints: (build) => ({
    getAllApiKeys: build.query<
      GetResponseApiKey,
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
           if (filters.type) {
            params.type = filters.type; // Convert number to string
          }
          if (filters.keywords) {
            params.keywords = filters.keywords; // Convert number to string
          }
        }

        return {
          url: "/api-keys",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "apiKeyApi", id: "LIST" }],
    }),
    addApiKey: build.mutation<GetResponseApiKeyDetails, ApiKeyType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/create-api-key",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "apiKeyApi", id: "LIST" }],
    }),
    updateApiKey: build.mutation<GetResponseApiKeyDetails, ApiKeyType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        const url = data?.revoked? `/api-key/${data?.id}?revoked=true`: `/api-key/${data?.id}`
        return {
          url:url,
          method: "put",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "apiKeyApi", id: "LIST" }],
    }),
    deleteApiKey: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/api-key/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "apiKeyApi", id: "LIST" }],
    }),
    
    getApiKeyDetails: build.query<
      GetResponseApiKeyDetails,
      { id: string }
    >({
      query: ({ id }) => {
        return {
          url: `/api-key/${id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "apiKeyApi", id: "LIST" }],
    }),
  }),
});
export const {
  useAddApiKeyMutation,
  useGetAllApiKeysQuery,
  useDeleteApiKeyMutation,
  useGetApiKeyDetailsQuery,
  useUpdateApiKeyMutation,
} = apiKeyApi;
