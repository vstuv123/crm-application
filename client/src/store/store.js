import { configureStore } from '@reduxjs/toolkit';
import { userAPI } from './slices/userSlice';
import { leadAPI } from './slices/leadSlice';
import { customerAPI } from './slices/customerSlice';
import { opportunityAPI } from './slices/opportunitySlice';
import { saleAPI } from './slices/saleSlice';
import { taskAPI } from './slices/taskSlice';
import { customerLogAPI } from './slices/customerLogSlice';

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [leadAPI.reducerPath]: leadAPI.reducer,
        [customerAPI.reducerPath]: customerAPI.reducer,
        [opportunityAPI.reducerPath]: opportunityAPI.reducer,
        [saleAPI.reducerPath]: saleAPI.reducer,
        [taskAPI.reducerPath]: taskAPI.reducer,
        [customerLogAPI.reducerPath]: customerLogAPI.reducer,
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        userAPI.middleware,
        leadAPI.middleware,
        customerAPI.middleware,
        opportunityAPI.middleware,
        saleAPI.middleware,
        taskAPI.middleware,
        customerLogAPI.middleware,
    ]
})