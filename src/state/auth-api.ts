import { apiKey, apiUrl } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  formData,
  LoginFormData,
  otpState,
  resendState,
  SigninResponse,
  SignupResponse,
} from "@/types/user-type";
import { AuditLogGetResponse, AuditLogQuery } from "@/types/audit-user-type";
import { getToken } from "@/lib/set-localstorage";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
            headers.set("Authorization", `Bearer ${getToken('token')}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes:["authApi", "auditUser"],
  endpoints: (build) => ({
    signup: build.mutation<SignupResponse, formData>({
      query: (data) => {
        console.log(data);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("phone", `${data.phone}`);
        formData.append("referredCode", `${data?.referredCode}`);
        return {
          url: "/auth/register",
          method: "POST",
          body: formData, // Pass the formData received from the mutation call
        };
      },
      invalidatesTags: [{ type: "authApi", id: "LIST" }],
    }),
    signin: build.mutation<SigninResponse, LoginFormData>({
      query: (data) => {
        console.log(data);
        const formData = new FormData();
        formData.append("email", data.email ?? ""); // Use default empty string if undefined
        formData.append("password", data.password ?? "");
        formData.append("provider", data.provider ?? "");
        return {
          url: "/auth/admin-login",
          method: "POST",
          body: formData, // Pass the formData received from the mutation call
        };
      },
      invalidatesTags: [{ type: "authApi", id: "LIST" }],
    }),
    logout: build.mutation<void, void>({
      query: () => {
        return {
          url: "/auth/logout",
          method: "POST",
          body: "",
        };
      },
      invalidatesTags: [{ type: "authApi", id: "LIST" }],
    }),
    otpVerification: build.mutation<void, otpState>({
      query: (data) => {
        const formData = new FormData();
        formData.append("otpValue", data.otpValue);
        formData.append("token", data.token ?? "");
        return {
          url: "/auth/verify-otp",
          method: "POST",
          body: formData, // Pass the formData received from the mutation call
        };
      },
      invalidatesTags: [{ type: "authApi", id: "LIST" }],
    }),
    reSend: build.mutation<void, resendState>({
      query: (data) => {
        const formData = new FormData();
        formData.append("token", data.token ?? "");
        return {
          url: "/auth/resend-otp",
          method: "POST",
          body: formData, // Pass the formData received from the mutation call
        };
      },
      invalidatesTags: [{ type: "authApi", id: "LIST" }],
    }),
    forgotPassword: build.mutation<void, { email: string }>({
      query: ({ email }) => {
        const formData = new FormData();
        formData.append("email", email);
        return {
          url: "auth/forgot-password",
          method: "POST",
          body: formData, // Pass the formData received from the mutation call
        };
      },
      invalidatesTags: [{ type: "authApi", id: "LIST" }],
    }),
     getAuditUser: build.query<
     AuditLogGetResponse,
     AuditLogQuery | void
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
              if (filters.actionType) {
                params.actionType = filters.actionType; // Convert number to string
              }
            }
    
            return {
              url: "/audit-user",
              params, // Use the dynamically constructed params
              method: "GET",
            };
          },
          providesTags: [{ type: "auditUser", id: "LIST" }],
        }),
  }),
});
export const {
  useSignupMutation,
  useOtpVerificationMutation,
  useReSendMutation,
  useForgotPasswordMutation,
  useSigninMutation,
  useLogoutMutation,useGetAuditUserQuery
} = authApi;