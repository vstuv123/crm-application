import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const customerAPI = createApi({
    reducerPath: 'customerAPI',
    baseQuery: fetchBaseQuery({ baseUrl: "https://crm-application-euve.onrender.com", credentials: "include" }),
    tagTypes: ["non-arc-customers", "arc-customers", "pending-customers", "customer"],
    endpoints: (builder) => ({
        createCustomerManager: builder.mutation({
            query: (userData) => ({
                url: "/api/v1/manager/create-customer",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["non-arc-customers"]
        }),
        createCustomerSalesRep: builder.mutation({
            query: (userData) => ({
                url: "/api/v1/sales/create-customer",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["non-arc-customers"]
        }),
        getNonArchivedCustomers: builder.query({
            query: ({ search, sort, company, industry }) => {
                let queryString = "/api/v1/manager/non-archived-customers";

                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (company) params.push(`company=${company}`);
                if (industry) params.push(`industry=${industry}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.nonArchivedCustomers ? data.nonArchivedCustomers : [] },
            providesTags: ["non-arc-customers"]
        }),
        getNonArchivedCustomersSales: builder.query({
            query: ({ search, sort, company, industry }) => {
                let queryString = "/api/v1/sales/non-archived-customers";

                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (company) params.push(`company=${company}`);
                if (industry) params.push(`industry=${industry}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.nonArchivedCustomers ? data.nonArchivedCustomers : [] },
            providesTags: ["non-arc-customers"]
        }),
        archiveCustomerSalesRep: builder.mutation({
            query: (id) => ({
                url: `/api/v1/sales/archive-customer/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["non-arc-customers", "arc-customers"]
        }),
        getArchivedCustomers: builder.query({
            query: ({ search, sort, company, industry }) => {
                let queryString = "/api/v1/manager/archived-customers";
                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (company) params.push(`company=${company}`);
                if (industry) params.push(`industry=${industry}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.archivedCustomers ? data.archivedCustomers : [] },
            providesTags: ["arc-customers"]
        }),
        getArchivedCustomersSales: builder.query({
            query: ({ search, sort, company, industry }) => {
                let queryString = "/api/v1/sales/archived-customers";
                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (company) params.push(`company=${company}`);
                if (industry) params.push(`industry=${industry}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.archivedCustomers ? data.archivedCustomers : [] },
            providesTags: ["arc-customers"]
        }),
        unarchiveCustomerSalesRep: builder.mutation({
            query: (id) => ({
                url: `/api/v1/sales/unarchive-customer/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["arc-customers", "non-arc-customers"]
        }),
        deleteCustomerSalesRep: builder.mutation({
            query: (id) => ({
                url: `/api/v1/sales/delete-customer/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["arc-customers"]
        }),
        getPendingCustomers: builder.query({
            query: ({ search, sort, company, industry }) => {
                let queryString = "/api/v1/manager/pending-customers";
                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (company) params.push(`company=${company}`);
                if (industry) params.push(`industry=${industry}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.pendingCustomers ? data.pendingCustomers : [] },
            providesTags: ["pending-customers"]
        }),
        getCustomerDetails: builder.query({
            query: (id) => `/api/v1/manager/single-customer/${id}`,
            providesTags: ["customer"]
        }),
        getCustomerDetailsSales: builder.query({
            query: (id) => `/api/v1/sales/single-customer/${id}`,
            providesTags: ["customer"]
        }),
        updatePendingCustomerStatusManager: builder.mutation({
            query: ({ id, status }) => ({
                url: `/api/v1/manager/update-pending-customer/${id}`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["pending-customers"]
        }),
        updateCustomerManager: builder.mutation({
            query: ({ id, name, contact, company, address, industry, notes, status, assignedTo }) => ({
                url: `/api/v1/manager/update-customer/${id}`,
                method: "PUT",
                body: { name, contact, company, address, industry, notes, status, assignedTo },
            }),
            invalidatesTags: ["non-arc-customers", "arc-customers", "pending-customers", "customer"]
        }),
        updateCustomerSalesRep: builder.mutation({
            query: ({ id, name, contact, company, address, industry, notes, status }) => ({
                url: `/api/v1/sales/update-customer/${id}`,
                method: "PUT",
                body: { name, contact, company, address, industry, notes, status },
            }),
            invalidatesTags: ["non-arc-customers", "arc-customers", "customer"]
        }),
        getCustomersOfSaleRep: builder.mutation({
            query: ({ id }) => ({
                url: "/api/v1/manager/get-customers/sales-rep",
                method: "POST",
                body: { id },
            }),
        }),
        getNonArchivedCustomersAdmin: builder.query({
            query: ({ search, sort, company, industry }) => {
                let queryString = "/api/v1/admin/non-archived-customers";

                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (company) params.push(`company=${company}`);
                if (industry) params.push(`industry=${industry}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.nonArchivedCustomers ? data.nonArchivedCustomers : [] },
            providesTags: ["non-arc-customers"]
        }),
        getArchivedCustomersAdmin: builder.query({
            query: ({ search, sort, company, industry }) => {
                let queryString = "/api/v1/admin/archived-customers";
                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (company) params.push(`company=${company}`);
                if (industry) params.push(`industry=${industry}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.archivedCustomers ? data.archivedCustomers : [] },
            providesTags: ["arc-customers"]
        }),
        getCustomerDetailsAdmin: builder.query({
            query: (id) => `/api/v1/admin/single-customer/${id}`,
            providesTags: ["customer"]
        }),
    })
});

export const { useCreateCustomerManagerMutation, useGetNonArchivedCustomersQuery, useGetArchivedCustomersQuery, useGetPendingCustomersQuery, useUpdatePendingCustomerStatusManagerMutation, useGetCustomerDetailsQuery, useUpdateCustomerManagerMutation, useGetCustomersOfSaleRepMutation, useGetNonArchivedCustomersAdminQuery, useGetArchivedCustomersAdminQuery, useGetCustomerDetailsAdminQuery, useCreateCustomerSalesRepMutation, useGetNonArchivedCustomersSalesQuery, useGetArchivedCustomersSalesQuery, useUnarchiveCustomerSalesRepMutation, useArchiveCustomerSalesRepMutation, useDeleteCustomerSalesRepMutation, useGetCustomerDetailsSalesQuery, useUpdateCustomerSalesRepMutation } = customerAPI;