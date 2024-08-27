import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:5000"

export const saleAPI = createApi({
    reducerPath: 'saleAPI',
    baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
    tagTypes: ["sales", "sale"],
    endpoints: (builder) => ({
        createSale: builder.mutation({
            query: (userData) => ({
                url: "/api/v1/sales/create-sale",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["sales"]
        }),

        getAllSalesSaleRep: builder.query({
            query: ({ sort, value, closedDate }) => {
                let queryString = "/api/v1/sales/get-all-sales";

                const params = [];
                if (sort) params.push(`sort=${sort}`);

                if (value[0] !== undefined && value[0] !== null && value[1] !== undefined && value[1] !== null) {
                    params.push(`value[gte]=${value[0]}&value[lte]=${value[1] === Infinity ? 99999999999 : value[1]}`);
                }
                if (closedDate) params.push(`closedDate=${closedDate}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.sales ? data.sales : [] },
            providesTags: ["sales"]
        }),
        getAllSalesManager: builder.query({
            query: ({ sort, value, closedDate }) => {
                let queryString = "/api/v1/manager/get-all-sales";

                const params = [];
                if (sort) params.push(`sort=${sort}`);

                if (value[0] !== undefined && value[0] !== null && value[1] !== undefined && value[1] !== null) {
                    params.push(`value[gte]=${value[0]}&value[lte]=${value[1] === Infinity ? 99999999999 : value[1]}`);
                }
                if (closedDate) params.push(`closedDate=${closedDate}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.sales ? data.sales : [] },
            providesTags: ["sales"]
        }),
        getAllSalesAdmin: builder.query({
            query: ({ sort, value, closedDate }) => {
                let queryString = "/api/v1/admin/get-all-sales";

                const params = [];
                if (sort) params.push(`sort=${sort}`);

                if (value[0] !== undefined && value[0] !== null && value[1] !== undefined && value[1] !== null) {
                    params.push(`value[gte]=${value[0]}&value[lte]=${value[1] === Infinity ? 99999999999 : value[1]}`);
                }
                if (closedDate) params.push(`closedDate=${closedDate}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.sales ? data.sales : [] },
            providesTags: ["sales"]
        }),
        getSalesOfCustomer: builder.mutation({
            query: ({ id }) => ({
                url: "/api/v1/sales/customer-sales",
                method: "POST",
                body: { id },
            }),
        }),
        deleteSale: builder.mutation({
            query: (id) => ({
                url: `/api/v1/sales/delete-sale/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["sales"]
        }),
        getSaleDetails: builder.query({
            query: (id) => `/api/v1/get-single-sale/${id}`,
            providesTags: ["sale"]
        }),
        updateSale: builder.mutation({
            query: ({ id, opportunity, value, customer, closedDate, productsSold, paymentTerms }) => ({
                url: `/api/v1/sales/update-sale/${id}`,
                method: "PUT",
                body: { opportunity, value, customer, closedDate, productsSold, paymentTerms },
            }),
            invalidatesTags: ["sales", "sale"]
        }),
        salesOfSaleRep: builder.mutation({
            query: ({ id }) => ({
                url: "/api/v1/manager/sales/sales-rep",
                method: "POST",
                body: { id }
            })
        }),
    })
});

export const { useCreateSaleMutation, useGetAllSalesSaleRepQuery, useDeleteSaleMutation, useGetSaleDetailsQuery, useUpdateSaleMutation, useGetSalesOfCustomerMutation, useGetAllSalesManagerQuery, useGetAllSalesAdminQuery, useSalesOfSaleRepMutation } = saleAPI;