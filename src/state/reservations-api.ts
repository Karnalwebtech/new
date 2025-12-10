import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import {
  GetResponseAllReservations,
  GetResponseReservationsDetails,
  ReservationsType,
} from "@/types/reservations-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reservationsApi = createApi({
  reducerPath: "reservationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["reservations"],
  endpoints: (build) => ({
    addreservations: build.mutation<void, ReservationsType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/add-reservations",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "reservations", id: "LIST" }],
    }),
    updatereservations: build.mutation<void, ReservationsType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/update-reservations/${data.id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "reservations", id: "LIST" }],
    }),
    getAllreservations: build.query<
      GetResponseAllReservations,
      {
        rowsPerPage?: number;
        page?: number;
        keywords?: string;
        stock_location_id?: string;
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
          if (filters.stock_location_id) {
            params.stock_location_id = filters.stock_location_id; // Convert number to string
          }
        }

        return {
          url: "/all-reservations",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "reservations", id: "LIST" }],
    }),
    getreservationsDetails: build.query<
      GetResponseReservationsDetails,
      {
        id: string;
      } | void
    >({
      query: (filters) => {
        return {
          url: `/reservations-details/${filters?.id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "reservations", id: "LIST" }],
    }),
    removereservations: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/delete-reservations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "reservations", id: "LIST" }],
    }),
  }),
});
export const {
  useAddreservationsMutation,
  useGetAllreservationsQuery,
  useRemovereservationsMutation,
  useGetreservationsDetailsQuery,
  useUpdatereservationsMutation,
} = reservationsApi;
