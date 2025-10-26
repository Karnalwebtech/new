import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GetResponseShippingProfile, GetResponseShippingProfileDetails, ShippingProfileTypes } from "@/types/shipping-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shippingProfileApi = createApi({
  reducerPath: "shippingProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["shippingprofile"],
  endpoints: (build) => ({
    getAllShippingProfileData: build.query<
      GetResponseShippingProfile,
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
          url: "/shipping-profiles",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "shippingprofile", id: "LIST" }],
    }),
    addShippingProfile: build.mutation<void, ShippingProfileTypes>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/shipping-profile-edit",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "shippingprofile", id: "LIST" }],
    }),
      updateShippingProfile: build.mutation<void, ShippingProfileTypes>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/shipping-profile-edit/${data?.id}`,
          method: "put",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "shippingprofile", id: "LIST" }],
    }),
    deleteShippingProfile: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/shipping-profile-delete/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "shippingprofile", id: "LIST" }],
    }),
    getShippingProfileDetails: build.query<GetResponseShippingProfileDetails, { id: string }>({
      query: ({id}) => {
        return {
          url: `/shipping-profile/${id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "shippingprofile", id: "LIST" }],
    }),
  }),
});
export const { useAddShippingProfileMutation,useGetAllShippingProfileDataQuery,useDeleteShippingProfileMutation,useGetShippingProfileDetailsQuery,useUpdateShippingProfileMutation } = shippingProfileApi;
