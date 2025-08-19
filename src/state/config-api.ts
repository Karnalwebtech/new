import { apiKey, apiUrl } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { configForm, configGetResponse } from "@/types/config-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const configApi = createApi({
  reducerPath: "configApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["configApi"],
  endpoints: (build) => ({
    addConfig: build.mutation<void, configForm[]>({
      query: (files) => {
        const updatedData = files.map(({ _id: _, ...rest }) => ({ ...rest }));
        const formData = new FormData();
        formData.append("data", JSON.stringify(updatedData)); // Convert other types to string
        return {
          url: "/add-config",
          method: "POST",
          body: formData, // Pass the formData received from the mutation call
        };
      },
      invalidatesTags: [{ type: "configApi", id: "LIST" }],
    }),
    getConfigs: build.query<configGetResponse, void>({
      query: () => {
        return {
          url: "/get-configs",
          method: "GEt",
        };
      },
      providesTags: [{ type: "configApi", id: "LIST" }],
    }),
    // files: build.query<
    //   GetFileResponse,
    //   {
    //     rowsPerPage?: number;
    //     page?: number;
    //     category?: string;
    //   } | void
    // >({
    //   query: (filters) => {
    //     const params: Record<string, string | number | boolean> = {};
    //     if (filters) {
    //       if (filters.rowsPerPage) {
    //         params.rowsPerPage = filters.rowsPerPage; // Convert number to string
    //       }
    //       if (filters.page) {
    //         params.page = filters.page; // Convert number to string
    //       }
    //       if (filters.category && filters.category !== "all") {
    //         params.category = filters.category;
    //       }
    //     }

    //     return {
    //       url: "/files",
    //       params, // Use the dynamically constructed params
    //       method: "GET",
    //     };
    //   },
    //   providesTags: [{ type: "configApi", id: "LIST" }],
    // }),
  }),
});
export const { useAddConfigMutation, useGetConfigsQuery } = configApi;
