import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GetAllRegionsResponse, RegionFrom } from "@/types/regions-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const regionsApi = createApi({
  reducerPath: "regionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["regionsApi"],
  endpoints: (build) => ({
    getAllRegionseData: build.query<
      GetAllRegionsResponse,
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
          url: "/regions",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "regionsApi", id: "LIST" }],
    }),
    addRegion: build.mutation<void, RegionFrom>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/create-region",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "regionsApi", id: "LIST" }],
    }),
    deleteRegion: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/delete-region/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "regionsApi", id: "LIST" }],
    }),
  }),
});
export const {
  useGetAllRegionseDataQuery,
  useDeleteRegionMutation,
  useAddRegionMutation,
} = regionsApi;
