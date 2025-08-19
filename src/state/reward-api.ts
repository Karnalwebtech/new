import { apiKey, apiUrl } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getRewardResponse } from "@/types/reward-type";
import { getToken } from "@/lib/set-localstorage";
export const rewardsApi = createApi({
  reducerPath: "rewardsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: async (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["rewardsApi"],
  endpoints: (build) => ({
    getAllRewards: build.query<
      getRewardResponse,
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
          url: "/all-rewards",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "rewardsApi", id: "LIST" }],
    }),
  }),
});
export const { useGetAllRewardsQuery } = rewardsApi;
