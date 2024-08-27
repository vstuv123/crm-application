import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:5000"

export const taskAPI = createApi({
    reducerPath: 'taskAPI',
    baseQuery: fetchBaseQuery({ baseUrl, credentials: "include" }),
    tagTypes: ["tasks", "task"],
    endpoints: (builder) => ({
        createTask: builder.mutation({
            query: (userData) => ({
                url: "/api/v1/create-task",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["tasks"]
        }),

        getAllTasks: builder.query({
            query: ({ search, sort, closedDate }) => {
                let queryString = "/api/v1/get-all-tasks";

                const params = [];
                if (search) params.push(`search=${search}`);
                if (sort) params.push(`sort=${sort}`);
                if (closedDate) params.push(`closedDate=${closedDate}`);

                if (params.length) queryString += `?${params.join("&")}`;
                return queryString;
            },
            transformResponse: (data) => { return data.tasks ? data.tasks : [] },
            providesTags: ["tasks"]
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/api/v1/delete-task/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["tasks"]
        }),
        getTaskDetails: builder.query({
            query: (id) => `/api/v1/get-single-task/${id}`,
            providesTags: ["task"]
        }),
        updateTask: builder.mutation({
            query: ({ id, name, status, taskDetails, closedDate }) => ({
                url: `/api/v1/update-task/${id}`,
                method: "PUT",
                body: { name, status, taskDetails, closedDate },
            }),
            invalidatesTags: ["tasks", "task"]
        }),
    })
});

export const { useCreateTaskMutation, useGetAllTasksQuery, useGetTaskDetailsQuery, useDeleteTaskMutation, useUpdateTaskMutation } = taskAPI;