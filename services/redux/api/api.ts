import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const api = createApi({
    reducerPath: 'restApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include',
    }),
    tagTypes: ['BoardList', 'BoardData', 'UserData'],
    endpoints: () => ({}),
});
