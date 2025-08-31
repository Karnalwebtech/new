import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import {
  GetResponseProductCategory,
  GetSingleResponseProductCategory,
  ProductCategoryFormData,
} from "@/types/product-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productCategoryApi = createApi({
  reducerPath: "productCategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["productCategoryApi"],
  endpoints: (build) => ({
    AddProductCategory: build.mutation<void, ProductCategoryFormData>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/create-product-category",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "productCategoryApi", id: "LIST" }],
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
      invalidatesTags: [{ type: "productCategoryApi", id: "LIST" }],
    }),
    GetProductCategory: build.query<
      GetResponseProductCategory,
      {
        type?: string;
        rowsPerPage?: number;
        page?: number;
        has_parent?: boolean;
      } | void
    >({
      query: (filters) => {
        const params: Record<string, string | number | boolean> = {};
        // Add filters to the query parameters if they are present
        if (filters) {
          const { rowsPerPage, page, has_parent } = filters;
          if (typeof rowsPerPage === "number") params.rowsPerPage = rowsPerPage;
          if (typeof page === "number") params.page = page;
          if (typeof has_parent === "boolean") params.has_parent = has_parent; // ✅ pass true OR false
        }
        return {
          url: "/product-categorys",
          params,
          method: "GET",
        };
      },
      providesTags: [{ type: "productCategoryApi", id: "LIST" }],
    }),
    getSingle: build.query<GetSingleResponseProductCategory, { id: string,query?:string }>({
      query: ({ id,query="" }) => {
        const url = query?`/product-category-details/${id}?q=${query}`:`/product-category-details/${id}`
        return{
          url,
          method: "GET",
        }
      },
      providesTags: [{ type: "productCategoryApi", id: "LIST" }],
    }),
    dupicateProductCategory: build.mutation<void, { id: string }>({
      query: (data) => {
        return {
          url: `/dublicate-product-category/${data?.id}`,
          method: "PUT",
        };
      },
      invalidatesTags: [{ type: "productCategoryApi", id: "LIST" }],
    }),
    deleteProductCategory: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/product-category-remove/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "productCategoryApi", id: "LIST" }],
    }),
  }),
});
export const {
  useAddProductCategoryMutation,
  useDeleteProductCategoryMutation,
  useGetProductCategoryQuery,
  useGetSingleQuery,
  useUpdateProductCategoryMutation,
  useDupicateProductCategoryMutation,
} = productCategoryApi;
