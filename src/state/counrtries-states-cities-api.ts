import { apiKey, apiUrl } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GETCountryStateCityResponse } from "@/types/country-state-city-type";
import { GetAllResponseStoreCurrencies } from "@/types/store-currincies-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface AddCurrencyPayload {
  currencies: string[];
  tax: Record<string, boolean>;
}

export const countriesStatesCitiesApi = createApi({
  reducerPath: "countriesStatesCitiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = getToken("token");
      if (apiKey) headers.set("x-api-key", apiKey);
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Country","State","City"],
  endpoints: (builder) => ({
    // addCurrency: builder.mutation<void, AddCurrencyPayload>({
    //   query: (data) => {
    //     const formData = new FormData();
    //     formData.append("data", JSON.stringify(data));

    //     return {
    //       url: "/add-store-currency",
    //       method: "POST",
    //       body: formData,
    //     };
    //   },
    //   invalidatesTags: [{ type: "Country-state-city", id: "LIST" }],
    // }),
    getAllCountories: builder.query<
      GETCountryStateCityResponse,
      {
        rowsPerPage?: number;
        page?: number;
        keywords?: string;
        isoCode?: string;
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
          if (filters.keywords) {
            params.keyword = filters.keywords; // Convert number to string
          }
           if (filters.isoCode) {
            params.isoCode = filters.isoCode; // Convert number to string
          }
        }

        return {
          url: "/countries",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "Country", id: "LIST" }],
    }),
     getCountorieByStates: builder.query<
      GETCountryStateCityResponse,
      {
        rowsPerPage?: number;
        page?: number;
        keywords?: string;
        countryCode?: string;
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
          if (filters.keywords) {
            params.keyword = filters.keywords; // Convert number to string
          }
           if (filters.countryCode) {
            params.countryCode = filters.countryCode; // Convert number to string
          }
        }

        return {
          url: "/countrie-states",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "State", id: "LIST" }],
    }),
      getStateByCities: builder.query<
      GETCountryStateCityResponse,
      {
        rowsPerPage?: number;
        page?: number;
        keywords?: string;
        stateCode?: string;
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
          if (filters.keywords) {
            params.keyword = filters.keywords; // Convert number to string
          }
           if (filters.stateCode) {
            params.stateCode = filters.stateCode; // Convert number to string
          }
        }

        return {
          url: "/countrie-state-cities",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "City", id: "LIST" }],
    }),
    // deleteCountry-state-city: builder.mutation<void, { id: string }>({
    //   query: ({ id }) => ({
    //     url: `remove-store-currency/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: [{ type: "Country-state-city", id: "LIST" }],
    // }),
    // updateTaxPriceCountry-state-city: builder.mutation<void, { id: string }>({
    //   query: ({ id }) => ({
    //     url: `update-tax-store-currency/${id}`,
    //     method: "PUT",
    //   }),
    //   invalidatesTags: [{ type: "Country-state-city", id: "LIST" }],
    // }),
  }),
});

export const {
  // useAddCurrencyMutation,
  useGetAllCountoriesQuery,
  useGetCountorieByStatesQuery,
  useGetStateByCitiesQuery,
  // useDeleteCountry-state-cityMutation,
  // useUpdateTaxPriceCountry-state-cityMutation,
} = countriesStatesCitiesApi;
