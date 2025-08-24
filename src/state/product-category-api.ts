import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import {
  TrackingApiResponse,
  TrackingDetailsApiResponse,
} from "@/types/post-event-tracking-type";
import { ProductCategoryFormData } from "@/types/product-type";
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
    AddProductCategory: build.mutation<
      void,
      ProductCategoryFormData
    >({
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
  }),
});
export const {useAddProductCategoryMutation} = productCategoryApi;
