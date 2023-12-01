import { boardsApiSlice } from '../boards/endpoints';
import { BoardMutationQueryFulfilled, Dispatch } from './types';

async function createNewStage(queryFulfilled: BoardMutationQueryFulfilled<StageResponse>, dispatch: Dispatch, boardId: string) {
    try {
        const { data } = await queryFulfilled;

        dispatch(
            boardsApiSlice.util.updateQueryData('getBoardDataById', boardId, draft => {
                draft.stages = [...draft.stages, data]
            }),
        );
    } catch (err) {
        console.log(err);
        dispatch(boardsApiSlice.util.invalidateTags(['BoardData']));
    }
}

export const pessimisticUpdate = {
    createNewStage,
};
