import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GetResponseProductCategory, ProductCategoryFormData } from "@/types/product-type";
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
    GetProductCategory: build.query<
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
          if (filters.rowsPerPage) {
            params.rowsPerPage = filters.rowsPerPage; // Convert number to string
          }
          if (filters.page) {
            params.page = filters.page; // Convert number to string
          }
        }
        return {
          url: "/product-categorys",
          params,
          method: "GET",
        };
      },
      providesTags: [{ type: "productCategoryApi", id: "LIST" }],
    }),
    deleteProductCategory: build.mutation<void, {id:string}>({
      query: ({id}) => ({
        url: `/product-category-remove/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "productCategoryApi", id: "LIST" }],
    }),
  }),
});
export const { useAddProductCategoryMutation,useDeleteProductCategoryMutation, useGetProductCategoryQuery } =
  productCategoryApi;
