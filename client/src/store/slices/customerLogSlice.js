import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const customerLogAPI = createApi({
    reducerPath: 'customerLogAPI',
    baseQuery: fetchBaseQuery({ baseUrl: "https://crm-application-euve.onrender.com", credentials: "include" }),
    tagTypes: ["logs", "log"],
    endpoints: (builder) => ({
        createCustomerLog: builder.mutation({
            query: (userData) => ({
                url: "/api/v1/sales/create-interaction",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["logs"]
        }),

        getAllLogs: builder.query({
            query: ({ sort, date }) => {
                let queryString = "/api/v1/sales/get-all-interactions";

                const params = [];
                if (sort) params.push(`sort=${sort}`);
                if (date) params.push(`date=${date}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.interactions ? data.interactions : [] },
            providesTags: ["logs"]
        }),

        getLogsOfCustomer: builder.mutation({
            query: ({ id }) => ({
                url: "/api/v1/sales/interactions-customer",
                method: "POST",
                body: { id },
            }),
        }),
        deleteLog: builder.mutation({
            query: (id) => ({
                url: `/api/v1/sales/delete-interaction/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["logs"]
        }),
        getLogDetails: builder.query({
            query: (id) => `/api/v1/sales/get-single-interaction/${id}`,
            providesTags: ["log"]
        }),
        updateLog: builder.mutation({
            query: ({ id, customer, interactionType, date, time, description }) => ({
                url: `/api/v1/sales/update-interaction/${id}`,
                method: "PUT",
                body: { customer, interactionType, date, time, description },
            }),
            invalidatesTags: ["logs", "log"]
        }),
    })
});

export const { useCreateCustomerLogMutation, useGetAllLogsQuery, useGetLogDetailsQuery, useUpdateLogMutation, useDeleteLogMutation, useGetLogsOfCustomerMutation } = customerLogAPI;