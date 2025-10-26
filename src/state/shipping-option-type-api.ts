import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GetResponseShippingOptionType, GetResponseShippingOptionTypeDetails, ShippingOptionTypes } from "@/types/shipping-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shippingOptionTypeApi = createApi({
  reducerPath: "shippingOptionTypeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["shippingOptionType"],
  endpoints: (build) => ({
    getAllShippingOptionTypeData: build.query<
      GetResponseShippingOptionType,
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
          url: "/shipping-option-types",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "shippingOptionType", id: "LIST" }],
    }),
    addShippingOptionType: build.mutation<void, ShippingOptionTypes>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/shipping-option-type-edit",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "shippingOptionType", id: "LIST" }],
    }),
      updateShippingOptionType: build.mutation<void, ShippingOptionTypes>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/shipping-option-type-edit/${data?.id}`,
          method: "put",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "shippingOptionType", id: "LIST" }],
    }),
    deleteShippingOptionType: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/shipping-option-type-delete/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "shippingOptionType", id: "LIST" }],
    }),
    getShippingOptionTypeDetails: build.query<GetResponseShippingOptionTypeDetails, { id: string }>({
      query: ({id}) => {
        return {
          url: `/shipping-option-type/${id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "shippingOptionType", id: "LIST" }],
    }),
  }),
});
export const { useAddShippingOptionTypeMutation,useGetAllShippingOptionTypeDataQuery,useDeleteShippingOptionTypeMutation,useGetShippingOptionTypeDetailsQuery,useUpdateShippingOptionTypeMutation } = shippingOptionTypeApi;
