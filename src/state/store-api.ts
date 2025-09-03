import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GETResponseStoreFront, StoreForm } from "@/types/store-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["storeApi"],
  endpoints: (build) => ({
    EditStore: build.mutation<void, StoreForm>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/store-edit",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "storeApi", id: "LIST" }],
    }),
    getStoreData: build.query<GETResponseStoreFront, void>({
      query: () => {
        return {
          url: `/store`,
          method: "GET",
        };
      },
      providesTags: [{ type: "storeApi", id: "LIST" }],
    }),
  }),
});
export const { useEditStoreMutation, useGetStoreDataQuery } = storeApi;
