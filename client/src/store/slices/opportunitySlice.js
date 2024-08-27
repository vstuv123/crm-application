import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:5000"

export const opportunityAPI = createApi({
    reducerPath: 'opportunityAPI',
    baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
    tagTypes: ["non-arc-opportunities", "arc-opportunities", "opportunity"],
    endpoints: (builder) => ({
        createOpportunity: builder.mutation({
            query: (userData) => ({
                url: "/api/v1/sales/create-opportunity",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["non-arc-opportunities"]
        }),
        getNonArchivedOpportunities: builder.query({
            query: ({ search, sort, stage, closedDate }) => {
                let queryString = "/api/v1/sales/un-archived-opportunities";

                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (stage) params.push(`stage=${stage}`);
                if (closedDate) params.push(`closedDate=${closedDate}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.nonArchivedOpportunities ? data.nonArchivedOpportunities : [] },
            providesTags: ["non-arc-opportunities"]
        }),
        getArchivedOpportunities: builder.query({
            query: ({ search, sort, stage, closedDate }) => {
                let queryString = "/api/v1/sales/archived-opportunities";

                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (stage) params.push(`stage=${stage}`);
                if (closedDate) params.push(`closedDate=${closedDate}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.archivedOpportunities ? data.archivedOpportunities : [] },
            providesTags: ["arc-opportunities"]
        }),
        getOpportunitiesOfLead: builder.mutation({
            query: ({ id }) => ({
                url: "/api/v1/sales/lead-opportunities",
                method: "POST",
                body: { id },
            }),
        }),
        archiveOpportunity: builder.mutation({
            query: (id) => ({
                url: `/api/v1/sales/archive-opportunity/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["non-arc-opportunities", "arc-opportunities"]
        }),
        unarchiveOpportunity: builder.mutation({
            query: (id) => ({
                url: `/api/v1/sales/un-archive-opportunity/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["arc-opportunities", "non-arc-opportunities"]
        }),
        deleteOpportunity: builder.mutation({
            query: (id) => ({
                url: `/api/v1/sales/delete-opportunity/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["arc-opportunities"]
        }),
        getOpportunityDetails: builder.query({
            query: (id) => `/api/v1/sales/single-opportunity/${id}`,
            providesTags: ["opportunity"]
        }),
        updateOpportunity: builder.mutation({
            query: ({ id, name, value, stage, closedDate, assignedTo }) => ({
                url: `/api/v1/sales/update-opportunity/${id}`,
                method: "PUT",
                body: { name, value, stage, closedDate, assignedTo },
            }),
            invalidatesTags: ["non-arc-opportunities", "arc-opportunities", "opportunity"]
        }),
    })
});

export const { useCreateOpportunityMutation, useGetNonArchivedOpportunitiesQuery, useGetArchivedOpportunitiesQuery, useArchiveOpportunityMutation, useUnarchiveOpportunityMutation, useDeleteOpportunityMutation, useGetOpportunitiesOfLeadMutation, useGetOpportunityDetailsQuery, useUpdateOpportunityMutation } = opportunityAPI;