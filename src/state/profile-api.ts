import { apiKey, apiUrl } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ChangePasswordForm,
  updateProfileField,
  UpdateProfilePostResponse,
} from "@/types/profile-types";
import { getToken } from "@/lib/set-localstorage";
export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: async (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["profileApi", "changePassword"],
  endpoints: (build) => ({
    updateProfile: build.mutation<
      UpdateProfilePostResponse,
      updateProfileField
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/update-profile",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "profileApi", id: "LIST" }],
    }),
    changePassword: build.mutation<{ success: boolean }, ChangePasswordForm>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/change-password",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "changePassword", id: "LIST" }],
    }),
  }),
});
export const { useUpdateProfileMutation, useChangePasswordMutation } =
  profileApi;
