import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GETIPLogSResponse, IPLogGetResponse } from "@/types/ip-track-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const trackUserApi = createApi({
  reducerPath: "trackUserApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["trackUserApi","iplogs"],
  endpoints: (build) => ({
    trackUsers: build.query<
      IPLogGetResponse,
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
          url: "/track-activity",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "trackUserApi", id: "LIST" }],
    }),
    trackFromIpLogs: build.query<
    GETIPLogSResponse,
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
          url: "/ip-track-activity",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "iplogs", id: "LIST" }],
    }),
  }),
});
export const { useTrackUsersQuery,useTrackFromIpLogsQuery } = trackUserApi;
