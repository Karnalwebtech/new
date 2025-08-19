import { apiKey, apiUrl } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { storageGetResponse } from "@/types/storage-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storageApi = createApi({
  reducerPath: "storageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["storageApi"],
  endpoints: (build) => ({
    getStorage: build.query<storageGetResponse, void>({
      query: () => {
        return {
          url: "/storage",
          method: "GET",
        };
      },
      providesTags: [{ type: "storageApi", id: "LIST" }],
    }),
  }),
});
export const { useGetStorageQuery } = storageApi;
