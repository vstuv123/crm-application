import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:5000"

export const leadAPI = createApi({
    reducerPath: 'leadAPI',
    baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
    tagTypes: ["non-arc-leads", "arc-leads", "pending-leads", "lead"],
    endpoints: (builder) => ({
        createLeadManager: builder.mutation({
            query: (userData) => ({
                url: "/api/v1/manager/create-lead",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["non-arc-leads"]
        }),
        createLeadSalesRep: builder.mutation({
            query: (userData) => ({
                url: "/api/v1/sales/create-lead",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["non-arc-leads"]
        }),
        getNonArchivedLeads: builder.query({
            query: ({ search, sort, source }) => {
                let queryString = "/api/v1/manager/non-archived";

                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (source) params.push(`source=${source}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.nonArchivedLeads ? data.nonArchivedLeads : [] },
            providesTags: ["non-arc-leads"]
        }),
        getNonArchivedLeadsSalesRep: builder.query({
            query: ({ search, sort, source }) => {
                let queryString = "/api/v1/sales/non-archived";

                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (source) params.push(`source=${source}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.nonArchivedLeads ? data.nonArchivedLeads : [] },
            providesTags: ["non-arc-leads"]
        }),
        getNonArchivedLeadsAdmin: builder.query({
            query: ({ search, sort, source }) => {
                let queryString = "/api/v1/admin/non-archived";

                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (source) params.push(`source=${source}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.nonArchivedLeads ? data.nonArchivedLeads : [] },
            providesTags: ["non-arc-leads"]
        }),
        archiveLeadSalesRep: builder.mutation({
            query: (id) => ({
                url: `/api/v1/sales/archive-lead/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["non-arc-leads", "arc-leads"]
        }),
        getArchivedLeads: builder.query({
            query: ({ search = "", sort = "", source = "" }) => {
                let queryString = "/api/v1/manager/archived";
                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (source) params.push(`source=${source}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.archivedLeads ? data.archivedLeads : [] },
            providesTags: ["arc-leads"]
        }),
        getArchivedLeadsSalesRep: builder.query({
            query: ({ search = "", sort = "", source = "" }) => {
                let queryString = "/api/v1/sales/archived";
                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (source) params.push(`source=${source}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.archivedLeads ? data.archivedLeads : [] },
            providesTags: ["arc-leads"]
        }),
        unarchiveLeadSalesRep: builder.mutation({
            query: (id) => ({
                url: `/api/v1/sales/unarchive-lead/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["arc-leads", "non-arc-leads"]
        }),
        deleteLeadSalesRep: builder.mutation({
            query: (id) => ({
                url: `/api/v1/sales/delete-lead/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["arc-leads"]
        }),
        getPendingLeads: builder.query({
            query: ({ search = "", sort = "", source = "" }) => {
                let queryString = "/api/v1/manager/pending";
                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (source) params.push(`source=${source}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.pendingLeads ? data.pendingLeads : [] },
            providesTags: ["pending-leads"]
        }),
        getLeadDetails: builder.query({
            query: (id) => `/api/v1/manager/single-lead/${id}`,
            providesTags: ["lead"]
        }),
        getLeadDetailsSales: builder.query({
            query: (id) => `/api/v1/sales/single-lead/${id}`,
            providesTags: ["lead"]
        }),
        updatePendingLeadStatusManager: builder.mutation({
            query: ({ id, status }) => ({
                url: `/api/v1/manager/update-pending/${id}`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["pending-leads"]
        }),
        updateLeadManager: builder.mutation({
            query: ({ id, name, contact, source, status, assignedTo }) => ({
                url: `/api/v1/manager/update-lead/${id}`,
                method: "PUT",
                body: { name, contact, source, status, assignedTo },
            }),
            invalidatesTags: ["non-arc-leads", "arc-leads", "pending-leads", "lead"]
        }),
        updateLeadSalesRep: builder.mutation({
            query: ({ id, name, contact, source, status }) => ({
                url: `/api/v1/sales/update-lead/${id}`,
                method: "PUT",
                body: { name, contact, source, status },
            }),
            invalidatesTags: ["non-arc-leads", "arc-leads", "lead"]
        }),
        getLeadsOfSaleRep: builder.mutation({
            query: ({ id }) => ({
                url: "/api/v1/manager/get-leads/sales-rep",
                method: "POST",
                body: { id },
            }),
        }),
    })
});

export const { useCreateLeadManagerMutation, useGetNonArchivedLeadsQuery, useGetArchivedLeadsQuery, useGetPendingLeadsQuery, useGetLeadDetailsQuery, useUpdatePendingLeadStatusManagerMutation, useUpdateLeadManagerMutation, useGetLeadsOfSaleRepMutation, useCreateLeadSalesRepMutation, useGetNonArchivedLeadsSalesRepQuery, useGetArchivedLeadsSalesRepQuery , useArchiveLeadSalesRepMutation, useUnarchiveLeadSalesRepMutation, useDeleteLeadSalesRepMutation, useGetLeadDetailsSalesQuery, useUpdateLeadSalesRepMutation, useGetNonArchivedLeadsAdminQuery} = leadAPI;