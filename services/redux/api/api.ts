import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { redirect } from 'next/navigation';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions,
) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        const origin = window.location.origin;
        window.location.assign(origin + '/login');
    }
    return result;
};

export const api = createApi({
    reducerPath: 'restApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['BoardList', 'BoardData', 'UserData'],
    endpoints: () => ({}),
});
