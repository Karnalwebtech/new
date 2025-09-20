import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import {
  GetResponseProductTag,
  GetResponseProductTagDetails,
  ProductTagType,
} from "@/types/product-type";
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
    getAllProductTagData: build.query<
      GetResponseProductTag,
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
          url: "/product-tags",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "apiKeyApi", id: "LIST" }],
    }),
    addApiKey: build.mutation<void, ProductTagType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/product-tag-edit",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "apiKeyApi", id: "LIST" }],
    }),
    updateProductTag: build.mutation<void, ProductTagType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/product-tag-edit/${data?.id}`,
          method: "put",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "apiKeyApi", id: "LIST" }],
    }),
    deleteProductTag: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/product-tag-delete/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "apiKeyApi", id: "LIST" }],
    }),
    getProductTagDetails: build.query<
      GetResponseProductTagDetails,
      { id: string }
    >({
      query: ({ id }) => {
        return {
          url: `/product-tag/${id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "apiKeyApi", id: "LIST" }],
    }),
  }),
});
export const {
  useAddApiKeyMutation,
  useGetAllProductTagDataQuery,
  useDeleteProductTagMutation,
  useGetProductTagDetailsQuery,
  useUpdateProductTagMutation,
} = apiKeyApi;
