import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import {
  GetResponseProductCategory,
  GetSingleResponseProductCategory,
  ProductCategoryFormData,
  ProductCollectionsFormData,
} from "@/types/product-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productCollectionsApi = createApi({
  reducerPath: "productCollectionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["productCollectionsApi"],
  endpoints: (build) => ({
    AddProductCollections: build.mutation<void, ProductCollectionsFormData>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/create-product-collections",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "productCollectionsApi", id: "LIST" }],
    }),
    UpdateProductCategory: build.mutation<void, ProductCategoryFormData>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/update-product-category/${data?.id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "productCollectionsApi", id: "LIST" }],
    }),
    GetProductCollections: build.query<
      GetResponseProductCategory,
      {
        type?: string;
        rowsPerPage?: number;
        page?: number;
      } | void
    >({
      query: (filters) => {
        const params: Record<string, string | number | boolean> = {};
        // Add filters to the query parameters if they are present
        if (filters) {
          const { rowsPerPage, page } = filters;
          if (typeof rowsPerPage === "number") params.rowsPerPage = rowsPerPage;
          if (typeof page === "number") params.page = page;
        }
        return {
          url: "/product-collections",
          params,
          method: "GET",
        };
      },
      providesTags: [{ type: "productCollectionsApi", id: "LIST" }],
    }),
    getSingle: build.query<
      GetSingleResponseProductCategory,
      { id: string; query?: string }
    >({
      query: ({ id, query = "" }) => {
        const url = query
          ? `/product-category-details/${id}?q=${query}`
          : `/product-category-details/${id}`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: [{ type: "productCollectionsApi", id: "LIST" }],
    }),
    dupicateProductCategory: build.mutation<void, { id: string }>({
      query: (data) => {
        return {
          url: `/dublicate-product-category/${data?.id}`,
          method: "PUT",
        };
      },
      invalidatesTags: [{ type: "productCollectionsApi", id: "LIST" }],
    }),
    deleteProductCategory: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/product-category-remove/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "productCollectionsApi", id: "LIST" }],
    }),
  }),
});
export const {
  useAddProductCollectionsMutation,
  useDeleteProductCategoryMutation,
  useGetProductCollectionsQuery,
  useGetSingleQuery,
  useUpdateProductCategoryMutation,
  useDupicateProductCategoryMutation,
} = productCollectionsApi;
