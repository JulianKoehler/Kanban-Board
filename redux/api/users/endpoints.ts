import { UserInfoReturn } from '@/types/data/user';
import { api } from '../api';

export const usersApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        getCurrenUserInfo: builder.query<UserInfoReturn, void>({
            query: () => 'users/current',
            keepUnusedDataFor: 0,
        }),
        getUserById: builder.query<UserInfoReturn, string>({
            query: id => `users/${id}`,
        }),
        searchAllUsers: builder.query<UserInfoReturn[], string>({
            query: q => `users/?q=${encodeURI(q)}`,
        }),
        deleteUserAccount: builder.mutation<void, void>({
            query: () => ({
                url: '/users/',
                method: 'DELETE',
            }),
        }),
        leaveBoard: builder.mutation<void, string>({
            query: (boardId) => ({
                url: '/users/',
                method: 'PUT',
                body: {
                    board_id: boardId
                }
            }),
            invalidatesTags: ['BoardList'],
        }),
    }),
});
