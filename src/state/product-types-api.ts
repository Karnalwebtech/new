import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import {
  GetResponseProductTypes,
  GetResponseProductTypesDetails,
  ProductTypes,
} from "@/types/product-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productTypesApi = createApi({
  reducerPath: "productTypesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["productTypesApi"],
  endpoints: (build) => ({
    getAllProductTypeData: build.query<
      GetResponseProductTypes,
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
          url: "/product-typess",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "productTypesApi", id: "LIST" }],
    }),
    addProductTypes: build.mutation<void, ProductTypes>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/product-types-edit",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "productTypesApi", id: "LIST" }],
    }),
    updateProductTypes: build.mutation<void, ProductTypes>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/product-types-edit/${data?.id}`,
          method: "put",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "productTypesApi", id: "LIST" }],
    }),
    deleteProductTypes: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/product-types-delete/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "productTypesApi", id: "LIST" }],
    }),
    getProductTypesDetails: build.query<
      GetResponseProductTypesDetails,
      { id: string }
    >({
      query: ({ id }) => {
        return {
          url: `/product-types/${id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "productTypesApi", id: "LIST" }],
    }),
  }),
});
export const {
  useAddProductTypesMutation,
  useGetAllProductTypeDataQuery,
  useDeleteProductTypesMutation,
  useGetProductTypesDetailsQuery,
  useUpdateProductTypesMutation,
} = productTypesApi;
