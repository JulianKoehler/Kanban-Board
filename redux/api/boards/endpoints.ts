import {
    BoardCreate,
    BoardCreateResponse,
    BoardDataResponse,
    BoardListItem,
    BoardListResponse,
    BoardUpdate,
} from '@/types/data/board';
import { api } from '../api';
import { pessimisticUpdate } from './pessimistic-updates';

export const boardsApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        getBoardList: builder.query<BoardListResponse, void>({
            query: () => 'boards/',
            providesTags: ['BoardList'],
        }),
        getBoardDataById: builder.query<BoardDataResponse, string>({
            query: id => `boards/${id}`,
            providesTags: ['BoardData'],
        }),
        createBoard: builder.mutation<BoardCreateResponse, BoardCreate>({
            query: ({ owner, contributors, ...data }) => ({
                url: 'boards/',
                method: 'POST',
                body: {
                    ...data,
                    owner_id: owner,
                    contributors: contributors.map(user => ({
                        id: user.id,
                        is_new: true,
                        marked_for_deletion: user?.markedForDeletion ?? false,
                    })),
                },
            }),
            invalidatesTags: ['BoardList'],
        }),
        updateBoard: builder.mutation<BoardDataResponse, { id: string; data: BoardUpdate }>({
            query: ({ id, data }) => {
                const { owner, contributors, ...rest } = data;

                return {
                    url: `boards/${id}`,
                    method: 'PUT',
                    body: {
                        ...rest,
                        owner_id: owner,
                        contributors: contributors.map(user => ({
                            id: user.id,
                            is_new: user?.isNew ?? false,
                            marked_for_deletion: user?.markedForDeletion ?? false,
                        })),
                    },
                };
            },
            invalidatesTags: ['BoardList'],
            async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
                pessimisticUpdate.updateBoard(queryFulfilled, dispatch, id);
            },
        }),
        deleteBoard: builder.mutation<void, string>({
            query: id => ({
                url: `boards/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['BoardList'],
        }),
    }),
});
