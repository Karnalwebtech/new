import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import {
  GetResponseServiseZoneType,
  GetResponseServiseZoneTypeDetails,
  ServiceZoneType,
} from "@/types/service-zone-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const serviceZoneApi = createApi({
  reducerPath: "serviceZoneApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["serviceZoneApi"],
  endpoints: (build) => ({
    addServiceZone: build.mutation<void, ServiceZoneType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/add-service-zone",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "serviceZoneApi", id: "LIST" }],
    }),
    updateServiceZone: build.mutation<void, ServiceZoneType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/update-service-zone/${data?.id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "serviceZoneApi", id: "LIST" }],
    }),
    deleteServiceZone: build.mutation<void, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/delete-service-zone-by-fullfillmentset/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [{ type: "serviceZoneApi", id: "LIST" }],
    }),
    getAllServiseZoneByFulfillmentid: build.query<
      GetResponseServiseZoneType,
      {
        id?: string;
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
          url: `/service-zone-by-fullfillmentset/${filters?.id}`,
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "serviceZoneApi", id: "LIST" }],
    }),
    getServiseZoneDetails: build.query<
      GetResponseServiseZoneTypeDetails,
      { id: string }
    >({
      query: ({ id }) => {
        return {
          url: `/service-zone/${id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "serviceZoneApi", id: "LIST" }],
    }),
  }),
});
export const {
  useAddServiceZoneMutation,
  useGetAllServiseZoneByFulfillmentidQuery,
  useDeleteServiceZoneMutation,
  useGetServiseZoneDetailsQuery,
  useUpdateServiceZoneMutation,
} = serviceZoneApi;
