import { apiUrl, apiKey } from "@/config";
import { getToken } from "@/lib/set-localstorage";
import { GetUpstashRedisDbList, GetUpstashRedisBrowserData, GetUpstashRedisEventLists, GetUpstashRedisDbDetails } from "@/types/upstash-redis-type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const upstashRedisApi = createApi({
  reducerPath: "upstashRedisApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", apiKey!); // Add API key here
      headers.set("Authorization", `Bearer ${getToken("token")}`); // Add API key here
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["upstashRedisApi", "EventList", "BroewserData"],
  endpoints: (build) => ({
    getUpstashRedisList: build.query<
      GetUpstashRedisDbList,
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
          url: "/get-upstash-list",
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "upstashRedisApi", id: "LIST" }],
    }),
    getUpstashRedisDBDetails: build.query<
      GetUpstashRedisDbDetails,
      {
        id: string
      } | void
    >({
      query: (data) => {
        return {
          url: `/get-upstash-db-details/${data?.id}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "upstashRedisApi", id: "LIST" }],
    }),
    getUpstashRedisEventLists: build.query<
      GetUpstashRedisEventLists,
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
          url: '/get-upstash-redis-event-lists',
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "EventList", id: "LIST" }],
    }),
    getUpstashRedisBrowserData: build.query<
      GetUpstashRedisBrowserData,
      {
        rowsPerPage?: number;
        page?: number;
        search?: string;
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
          if (filters.search) {
            params.search = filters.search; // Convert number to string
          }
        }

        return {
          url: '/get-upstash-redis-browser-data',
          params, // Use the dynamically constructed params
          method: "GET",
        };
      },
      providesTags: [{ type: "BroewserData", id: "LIST" }],
    }),
    clearCacheUsingKeys: build.mutation<
      void,
      {
        keys?: string[];
      }
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        return {
          url: "/clear-cached-using-keys",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "BroewserData", id: "LIST" }],
    }),
    clearCacheByPattern: build.mutation<
      void,
      {
        key?: string;
      }
    >({
      query: ({ key }) => {
        return {
          url: `/clear-cache-by-pattern/${key}`,
          method: "POST",
          body:{}
        };
      },
      invalidatesTags: [{ type: "BroewserData", id: "LIST" }],
    }),
    cacheFlush: build.mutation<
      void,
      void
    >({
      query: () => {

        return {
          url: `/cache-flush`,
          method: "POST",
        };
      },
      invalidatesTags: [{ type: "BroewserData", id: "LIST" }],
    }),
  }),
});
export const {
  useGetUpstashRedisListQuery,
  useGetUpstashRedisDBDetailsQuery,
  useGetUpstashRedisEventListsQuery,
  useGetUpstashRedisBrowserDataQuery,
  useClearCacheUsingKeysMutation,
  useClearCacheByPatternMutation,
  useCacheFlushMutation,
} = upstashRedisApi;
