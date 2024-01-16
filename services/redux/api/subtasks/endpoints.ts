import { SubtaskResponse } from '@/types/data/subtask';
import { api } from '../api';
import { pessimisticUpdate } from './pessimistic-updates';
import { SubtaskMarkRequest } from './types';

export const subtasksApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        toggleSubtaskComplete: builder.mutation<SubtaskResponse, SubtaskMarkRequest>({
            query: ({ id }) => ({
                url: `subtasks/${id}`,
                method: 'PUT',
            }),
            async onQueryStarted({ id, boardId }, { dispatch, queryFulfilled }) {
                pessimisticUpdate.markSubtask(queryFulfilled, dispatch, id, boardId);
            },
        }),
    }),
});
