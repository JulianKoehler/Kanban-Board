import { UserInfoReturn } from '@/types/data/user';
import { api } from '../api';

export const usersApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        getCurrenUserInfo: builder.query<UserInfoReturn, void>({
            query: () => 'users/current',
            keepUnusedDataFor: 5,
        }),
        getUserById: builder.query<UserInfoReturn, string>({
            query: id => `users/${id}`,
        }),
        deleteUserAccount: builder.mutation<void, void>({
            query: () => ({
                url: '/users/',
                method: 'DELETE',
            }),
        }),
    }),
});
