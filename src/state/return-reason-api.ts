import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GetResponseReturnReason, GetResponseReturnReasonDetails, ReturnReasonType } from "@/types/return-reason-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const returnReasonApi = createApi({
  reducerPath: "returnReason",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["returnReason"],
  endpoints: (build) => ({
    getAllReturnReasonData: build.query<
      GetResponseReturnReason,
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
          url: "/return-reasons",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "returnReason", id: "LIST" }],
    }),
    addReturnReason: build.mutation<void, ReturnReasonType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/return-reason-edit",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "returnReason", id: "LIST" }],
    }),
      updateReturnReason: build.mutation<void, ReturnReasonType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/return-reason-edit/${data?.id}`,
          method: "put",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "returnReason", id: "LIST" }],
    }),
    deleteReturnReason: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/return-reason-delete/${id}`,
        method: "DELETE", // Use DELETE instead of PUT
      }),
      invalidatesTags: [{ type: "returnReason", id: "LIST" }],
    }),
    getReturnReasonDetails: build.query<GetResponseReturnReasonDetails, { id: string }>({
      query: ({id}) => {
        return {
          url: `/return-reason/${id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "returnReason", id: "LIST" }],
    }),
  }),
});
export const { useAddReturnReasonMutation,useGetAllReturnReasonDataQuery,useDeleteReturnReasonMutation,useGetReturnReasonDetailsQuery,useUpdateReturnReasonMutation } = returnReasonApi;
