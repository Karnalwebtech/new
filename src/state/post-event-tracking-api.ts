import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { TrackingApiResponse, TrackingDetailsApiResponse } from "@/types/post-event-tracking-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postEventTrackingApi = createApi({
  reducerPath: "postEventTrackingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["postEventTrackingApi", "postEventTrackingDetailsApi", "allpostEventsTrackingApi", "allpostEventTrackingDetailsApi"],
  endpoints: (build) => ({
    postEventTracking: build.query<
      TrackingApiResponse,
      {
        rowsPerPage?: number;
        page?: number;
      } | void
    >({
      query: (filters) => {
        const params: Record<string, string | number | boolean> = {};
        if (filters) {
          if (filters.rowsPerPage) {
            params.rowsPerPage = filters.rowsPerPage; // Convert number to string
          }
          if (filters.page) {
            params.page = filters.page; // Convert number to string
          }
        }

        return {
          url: "/get-post-traking-event",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "postEventTrackingApi", id: "LIST" }],
    }),

    postEventTrackingDetails: build.query<
      TrackingDetailsApiResponse,
      {
        rowsPerPage?: number;
        page?: number;
        type?: string;
      } | void
    >({
      query: (filters) => {
        const params: Record<string, string | number | boolean> = {};
        if (filters) {
          if (filters.rowsPerPage) {
            params.rowsPerPage = filters.rowsPerPage; // Convert number to string
          }
          if (filters.page) {
            params.page = filters.page; // Convert number to string
          }
          if (filters.type) {
            params.type = filters.type; // Convert number to string
          }
        }

        return {
          url: "/get-post-traking-details",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "postEventTrackingDetailsApi", id: "LIST" }],
    }),

    getAllpostEventTrackingDetails: build.query<
      TrackingDetailsApiResponse,
      {
        rowsPerPage?: number;
        page?: number;
        type?: string;
      } | void
    >({
      query: (filters) => {
        const params: Record<string, string | number | boolean> = {};
        if (filters) {
          if (filters.rowsPerPage) {
            params.rowsPerPage = filters.rowsPerPage; // Convert number to string
          }
          if (filters.page) {
            params.page = filters.page; // Convert number to string
          }
          if (filters.type) {
            params.type = filters.type; // Convert number to string
          }
        }

        return {
          url: "/get-all-post-traking-details",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "allpostEventTrackingDetailsApi", id: "LIST" }],
    }),
    getAllpostEventsTracking: build.query<
      TrackingApiResponse,
      {
        rowsPerPage?: number;
        page?: number;
        type?: string;
      } | void
    >({
      query: (filters) => {
        const params: Record<string, string | number | boolean> = {};
        if (filters) {
          if (filters.rowsPerPage) {
            params.rowsPerPage = filters.rowsPerPage; // Convert number to string
          }
          if (filters.page) {
            params.page = filters.page; // Convert number to string
          }
          if (filters.type) {
            params.type = filters.type; // Convert number to string
          }
        }

        return {
          url: "/get-all-post-traking-events",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "allpostEventsTrackingApi", id: "LIST" }],
    }),

  }),
});
export const {
  usePostEventTrackingQuery,
  usePostEventTrackingDetailsQuery,
  useGetAllpostEventTrackingDetailsQuery,
  useGetAllpostEventsTrackingQuery
} = postEventTrackingApi;
