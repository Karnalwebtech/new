import { apiKey, apiUrl } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { CloudStorageForm, GetCloudStorage, GetCloudStorageResponse } from "@/types/cloud-storage-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cloudStorageApi = createApi({
  reducerPath: "cloudStorageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken('token')}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["cloudStorageApi"],
  endpoints: (build) => ({
    addCloudStorage: build.mutation<void, CloudStorageForm>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data)); // Convert other types to string
        return {
          url: "/add-cloud-storages",
          method: "POST",
          body: formData, // Pass the formData received from the mutation call
        };
      },
      invalidatesTags: [{ type: "cloudStorageApi", id: "LIST" }],
    }),
    removeCloudStorage: build.mutation<void, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/remove-cloud-storages/${id}`,
          method: "Delete",
        };
      },
      invalidatesTags: [{ type: "cloudStorageApi", id: "LIST" }],
    }),
    getCloudStorage: build.query<
      GetCloudStorage,
      void
    >({
      query: () => {
        return {
          url: "/get-all-storages",
          method: "GET",
        };
      },
      providesTags: [{ type: "cloudStorageApi", id: "LIST" }],
    }),
    getAllStorages: build.query<
      GetCloudStorageResponse,
      {
        rowsPerPage?: number;
        page?: number;
        storage_type?: string | null;
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
          if (filters.storage_type) {
            params.storage_type = filters.storage_type; // Convert number to string
          }
        }

        return {
          url: "/get-cloud-storages",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "cloudStorageApi", id: "LIST" }],
    }),
  }),
});
export const { useGetCloudStorageQuery, useAddCloudStorageMutation, useGetAllStoragesQuery, useRemoveCloudStorageMutation } = cloudStorageApi;
