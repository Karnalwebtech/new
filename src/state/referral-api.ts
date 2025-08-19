import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { getresponseReferral, getresponseReferralDetails } from "@/types/referral-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const referralApi = createApi({
    reducerPath: "referralApi",
    baseQuery: fetchBaseQuery({
        baseUrl: apiUrl,
        prepareHeaders: (headers) => {
            headers.set("x-api-key", apiKey!); // Add API key here
            headers.set("Authorization", `Bearer ${getToken('token')}`); // Add API key here
            return headers;
        },
        credentials: "include",
    }),
    tagTypes: ["referralApi"],
    endpoints: (build) => ({
        referraldetails: build.query<
        getresponseReferralDetails,
        {click?:number,timePeriod?:string} | void
        >({
            query: (filters) => {
                const params: Record<string, string | number | boolean> = {};
                if (filters) {
                  if(filters.timePeriod){
                    params.timePeriod = filters.timePeriod; // Convert number to string
                  }
                  if (filters.click) {
                    params.click = filters.click; // Convert number to string
                  }
                }
                return {
                    url: "/referral-details",
                    params,
                    method: "GET",
                };
            },
            providesTags: [{ type: "referralApi", id: "LIST" }],
        }),
        updateClaim: build.mutation<
        void,
        {amount:string,id:string} | void
        >({
            query: (data) => {
             const formData = new FormData();
             formData.append("data",JSON.stringify(data))
                return {
                    url: "/update-referral",
                    method: "POST",
                    body:formData
                };
            },
            invalidatesTags: [{ type: "referralApi", id: "LIST" }],
        }),
        getReferrals: build.query<
        getresponseReferral,
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
                  url: "/all-referrals",
                  params, // Use the dynamically constructed params
                  method: "GET",
                };
              },
              providesTags: [{ type: "referralApi", id: "LIST" }],
            }),
          }),
          
});
export const {
    useReferraldetailsQuery,
    useGetReferralsQuery,
    useUpdateClaimMutation
} = referralApi;