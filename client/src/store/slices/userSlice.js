import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({ baseUrl: "https://crm-application-euve.onrender.com", credentials: "include" }),
    tagTypes: ["users", "user"],
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: ({ search = "", sort = "" }) => {
                let queryString = "/api/v1/admin/users";
                if (search || sort) {
                    queryString += `?`;
                    if (search) queryString += `search=${search}`;
                    if (search && sort) queryString += `&`;
                    if (sort) queryString += `sort=${sort}`;
                  }
                return queryString;
            },
            transformResponse: (data) => { return data.users ? data.users : [] },
            providesTags: ["users"]
        }),
        getUserDetailsAdmin: builder.query({
            query: (id) => `/api/v1/admin/user/${id}`,
            providesTags: ["user"],
        }),
        createUser: builder.mutation({
            query: (userData) => ({
                url: "/api/v1/admin/create",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["users"]
        }),
        updateUserAdmin: builder.mutation({
            query: ({ id, role, salesTeam, assignedTo }) => ({
                url: `/api/v1/admin/update-profile/${id}`,
                method: "PUT",
                body: { role, salesTeam, assignedTo },
            }),
            invalidatesTags: ["users", "user"]
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/api/v1/admin/delete-user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["users"]
        }),
        loginUser: builder.mutation({
            query: (userData) => ({
                url: "/api/v1/login",
                method: "POST",
                body: userData,
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "/api/v1/logout",
                method: "POST"
            }),
        }),
        forgotPassword: builder.mutation({
            query: (userData) => ({
                url: "/api/v1/password/forgot",
                method: "POST",
                body: userData,
            })
        }),
        resetPassword: builder.mutation({
            query: ({ token, password, confirmPassword}) => ({
                url: `/api/v1/password/reset/${token}`,
                method: "PUT",
                body: { password, confirmPassword },
            })
        }),
        updateProfileUser: builder.mutation({
            query: (userData) => ({
                url: `/api/v1/update-profile`,
                method: "PUT",
                body: userData,
            })
        }),
        updatePasswordUser: builder.mutation({
            query: (userData) => ({
                url: `/api/v1/update-password`,
                method: "PUT",
                body: userData,
            })
        }),
        getSalesTeamManager: builder.query({
            query: ({ search = "", sort = "" }) => {
                let queryString = "/api/v1/manager/users";
                if (search || sort) {
                    queryString += `?`;
                    if (search) queryString += `search=${search}`;
                    if (search && sort) queryString += `&`;
                    if (sort) queryString += `sort=${sort}`;
                  }
                return queryString;
            },
        }),
        getSalesRepDetails: builder.query({
            query: (id) => `/api/v1/manager/user-details/${id}`,
        }),
        getManagerDetails: builder.query({
            query: () => `/api/v1/sales/manager-details`,
        }),
    })
});

export const { useLoginUserMutation, useLogoutUserMutation, useForgotPasswordMutation, useResetPasswordMutation, useUpdateProfileUserMutation, useUpdatePasswordUserMutation, useCreateUserMutation, useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserAdminMutation, useGetUserDetailsAdminQuery, useGetSearchedUsersQuery, useGetSalesTeamManagerQuery, useGetSalesRepDetailsQuery, useGetManagerDetailsQuery } = userAPI;