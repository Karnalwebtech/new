import { apiKey, apiUrl } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetsocialProfileDetails,
  GetsocialProfiles,
  SocialProfileForm,
} from "@/types/social-profile-type";
import { getToken } from "@/lib/set-localstorage";
export const socialProfileApi = createApi({
  reducerPath: "socialProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: async (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["socialProfileApi"],
  endpoints: (build) => ({
    addSocialProfile: build.mutation<void, SocialProfileForm>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/add-social-profile",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "socialProfileApi", id: "LIST" }],
    }),
    updateSocialProfile: build.mutation<void, SocialProfileForm>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: `/update-social-profile/${data?.id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "socialProfileApi", id: "LIST" }],
    }),
    removeSocialProfile: build.mutation<void, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/remove-social-profile/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [{ type: "socialProfileApi", id: "LIST" }],
    }),
    getSocialProfileDetails: build.query<
      GetsocialProfileDetails,
      { id: string }
    >({
      query: ({ id }) => {
        return {
          url: `/details-social-profiles/${id}`,
          method: "get",
        };
      },
      providesTags: [{ type: "socialProfileApi", id: "LIST" }],
    }),

    getAllSocialProfile: build.query<
      GetsocialProfiles,
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
          url: "/social-profiles",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "socialProfileApi", id: "LIST" }],
    }),
  }),
});
export const {
  useAddSocialProfileMutation,
  useUpdateSocialProfileMutation,
  useGetAllSocialProfileQuery,
  useGetSocialProfileDetailsQuery,
  useRemoveSocialProfileMutation,
} = socialProfileApi;
