import { apiKey, apiUrl } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import {
  customFields,
  GetCustomFieldsResponse,
} from "@/types/custom-field-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customFieldApi = createApi({
  reducerPath: "customFieldApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["customFieldApi"],
  endpoints: (build) => ({
    addCustomField: build.mutation<void, customFields[]>({
      query: (files) => {
        const updatedData = files.map(({ id: _, ...rest }) => ({ ...rest }));
        const formData = new FormData();
        formData.append("data", JSON.stringify(updatedData)); // Convert other types to string
        return {
          url: "/add-custom-fields",
          method: "POST",
          body: formData, // Pass the formData received from the mutation call
        };
      },
      invalidatesTags: [{ type: "customFieldApi", id: "LIST" }],
    }),
    getCustomField: build.query<GetCustomFieldsResponse,
      {
        rowsPerPage?: number;
        page?: number;
        page_id?: string;
        field_type?: string | null;
        search_type?: string | null;
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
          if (filters.page_id && filters.page_id !== "all") {
            params.page_id = filters.page_id;
          }
          if (filters.field_type && filters.field_type) {
            params.field_type = filters.field_type;
          }
          if (filters.search_type && filters.search_type) {
            params.search_type = filters.search_type;
          }
        }

        return {
          url: "/get-custom-fields",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "customFieldApi", id: "LIST" }],
    }),
  }),
});
export const { useAddCustomFieldMutation, useGetCustomFieldQuery } =
  customFieldApi;
