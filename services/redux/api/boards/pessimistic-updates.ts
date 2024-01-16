import { BoardDataResponse } from '@/types/data/board';
import { boardsApiSlice } from './endpoints';
import { BoardMutationQueryFulfilled, Dispatch } from './types';

async function updateBoard(
    queryFulfilled: BoardMutationQueryFulfilled<BoardDataResponse>,
    dispatch: Dispatch,
    id: string,
) {
    try {
        const { data } = await queryFulfilled;

        dispatch(
            boardsApiSlice.util.updateQueryData('getBoardDataById', id ?? 'no_id', draft => {
                draft.id = data.id;
                draft.stages = data.stages;
                draft.title = data.title;
                draft.owner = data.owner;
                draft.contributors = data.contributors;
            }),
        );
    } catch (err) {
        console.log(err);
        dispatch(boardsApiSlice.util.invalidateTags(['BoardData']));
    }
}

export const pessimisticUpdate = {
    updateBoard,
};
