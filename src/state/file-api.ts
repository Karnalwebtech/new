import { apiKey, apiUrl } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { FileForm, GetFileDetailsResponse, GetFileResponse, UploadFileResponse } from "@/types/file-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fileApi = createApi({
  reducerPath: "fileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["fileApi"],
  endpoints: (build) => ({
    uploadFiles: build.mutation<UploadFileResponse, File[]>({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file); // "files" should match your API's expected field name
        });
        return {
          url: "/file-upload",
          method: "POST",
          body: formData, // Pass the formData received from the mutation call
        };
      },
      invalidatesTags: [{ type: "fileApi", id: "LIST" }],
    }),
    files: build.query<
      GetFileResponse,
      {
        rowsPerPage?: number;
        page?: number;
        category?: string;
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
          if (filters.category && filters.category !== "all") {
            params.category = filters.category;
          }
        }

        return {
          url: "/files",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "fileApi", id: "LIST" }],
    }),
    getFileDetails: build.query<
      GetFileDetailsResponse,
      {
        id: string
      }
    >({
      query: ({ id }) => {
        return {
          url: `/files-details/${id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "fileApi", id: "LIST" }],
    }),
    updateFiles: build.mutation<void, FileForm>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data))
        return {
          url: `/update-file/${data?.id}`,
          method: "PUT",
          body: formData, // Pass the formData received from the mutation call
        };
      },
      invalidatesTags: [{ type: "fileApi", id: "LIST" }],
    })
  }),
});
export const { useUploadFilesMutation, useFilesQuery, useGetFileDetailsQuery, useUpdateFilesMutation } = fileApi;
