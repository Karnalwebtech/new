import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GetResponseReturnReason, GetResponseReturnReasonDetails, ReturnReasonType } from "@/types/return-reason-type";
import { GetResponseTaxRegion, GetResponseTaxRegionDetails, TaxRegionType } from "@/types/tax-region-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taxRegionApi = createApi({
  reducerPath: "taxRegionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["taxregion"],
  endpoints: (build) => ({
    getAllTaxRegionData: build.query<
      GetResponseTaxRegion,
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
          url: "/tax-regions",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "taxregion", id: "LIST" }],
    }),
    addTaxRegion: build.mutation<void, TaxRegionType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/tax-region-edit",
          method: "post",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "taxregion", id: "LIST" }],
    }),
      updateTaxRegion: build.mutation<void, TaxRegionType>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/tax-region-edit/${data?.id}`,
          method: "put",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "taxregion", id: "LIST" }],
    }),
    // deleteReturnReason: build.mutation<void, { id: string }>({
    //   query: ({ id }) => ({
    //     url: `/return-reason-delete/${id}`,
    //     method: "DELETE", // Use DELETE instead of PUT
    //   }),
    //   invalidatesTags: [{ type: "taxregion", id: "LIST" }],
    // }),
    getTaxRegionDetails: build.query<GetResponseTaxRegionDetails, { id: string }>({
      query: ({id}) => {
        return {
          url: `/tax-regions/${id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "taxregion", id: "LIST" }],
    }),
  }),
});
export const { useAddTaxRegionMutation,
  useGetAllTaxRegionDataQuery,
  // useDeleteReturnReasonMutation,
  useGetTaxRegionDetailsQuery,
  useUpdateTaxRegionMutation
 } = taxRegionApi;
