import { apiKey, apiUrl } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { ContactsForm, getContactsDetailsResponse, getContactsResponse } from "@/types/contacts-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactsApi = createApi({
  reducerPath: "Contacts",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Contacts"],
  endpoints: (build) => ({
    addContacts: build.mutation<void, Array<Record<string, string | string[]>>>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data)); // Convert other types to string
        return {
          url: "add-contacts",
          method: "POST",
          body: formData, // Pass the formData received from the mutation call
        };
      },
      invalidatesTags: [{ type: "Contacts", id: "LIST" }],
    }),
    // Query to get all contacts
    getAllContacts: build.query<
      getContactsResponse,
      { type?: string; rowsPerPage?: number; page?: number, id?: string } | void
    >({
      query: (filters) => {
        const params: Record<string, string | number | boolean> = {};
        if (filters) {
          if (filters.rowsPerPage) params.rowsPerPage = filters.rowsPerPage;
          if (filters.page) params.page = filters.page;
          if (filters.type) params.type = filters.type;
          if (filters.id) params.tags = filters.id;

        }

        return {
          url: "all-contacts",
          params,
          method: "GET",
        };
      },
      providesTags: [{ type: "Contacts", id: "LIST" }],
    }),
    getContactsDetails: build.query<
      getContactsDetailsResponse,
      { id?: string } | void
    >({
      query: (data) => {
        return {
          url: `/contacts-details/${data?.id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "Contacts", id: "LIST" }],
    }),
    updateContacts: build.mutation<void, ContactsForm>({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data))
        return {
          url: `update-details/${data.id}`,
          method: "PUT",
          body: formData, // Use formData as body
        };
      },
      invalidatesTags: [{ type: "Contacts", id: "LIST" }],
    }),
    removeContacts: build.mutation<void, { id: string }>({
      query: (data) => {
        return {
          url: `remove-contacts/${data.id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [{ type: "Contacts", id: "LIST" }],
    }),
  }),
});
export const { useAddContactsMutation, useGetAllContactsQuery, useGetContactsDetailsQuery, useUpdateContactsMutation,useRemoveContactsMutation } = contactsApi;
