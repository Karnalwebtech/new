import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import {
  GetResponseProductCollection,
  GetSingleResponseProductCollection,
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
    UpdateProductCollections: build.mutation<void, ProductCollectionsFormData>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/update-product-collections/${data?.id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "productCollectionsApi", id: "LIST" }],
    }),
    GetProductCollections: build.query<
      GetResponseProductCollection,
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
      GetSingleResponseProductCollection,
      { id: string; query?: string }
    >({
      query: ({ id}) => {
        return {
          url:`/product-collection-details/${id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "productCollectionsApi", id: "LIST" }],
    }),
    dupicateProductCollection: build.mutation<void, { id: string }>({
      query: (data) => {
        return {
          url: `/dublicate-product-collection/${data?.id}`,
          method: "PUT",
        };
      },
      invalidatesTags: [{ type: "productCollectionsApi", id: "LIST" }],
    }),
    deleteProductCollction: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/product-collection-remove/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "productCollectionsApi", id: "LIST" }],
    }),
  }),
});
export const {
  useAddProductCollectionsMutation,
  useDeleteProductCollctionMutation,
  useGetProductCollectionsQuery,
  useGetSingleQuery,
  useUpdateProductCollectionsMutation,
  useDupicateProductCollectionMutation,
} = productCollectionsApi;
