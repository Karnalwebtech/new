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
    getRegionseData: build.query<GetAllRegionsResponse, void>({
      query: () => {
        return {
          url: `/regions`,
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
  }),
});
export const { useGetRegionseDataQuery, useAddRegionMutation } = regionsApi;
