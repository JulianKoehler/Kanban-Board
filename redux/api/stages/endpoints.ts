import { api } from '../api';
import { pessimisticUpdate } from './pessimistic-updates';

export const stagesApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        createStage: builder.mutation<StageResponse, Required<StageCreate>>({
            query: ({ boardId, ...props }) => ({
                url: '/stages',
                method: 'POST',
                body: {
                    board_id: boardId,
                    ...props,
                },
            }),
            async onQueryStarted({ boardId }, { dispatch, queryFulfilled }) {
              pessimisticUpdate.createNewStage(queryFulfilled, dispatch, boardId)
            },
        }),
    }),
});
