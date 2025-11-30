import { apiKey, apiUrl } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "@/lib/set-localstorage";

export const shippingOptionsApi = createApi({
  reducerPath: "shippingOptionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: async (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["shippingOptionsApi"],
  endpoints: (build) => ({
    addShippingOptions: build.mutation<void, { data: string }>({
      query: (data) => {
        return {
          url: "/add-shipping-option",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [{ type: "shippingOptionsApi", id: "LIST" }],
    }),

  }),
});
export const {
  useAddShippingOptionsMutation,
} = shippingOptionsApi;
