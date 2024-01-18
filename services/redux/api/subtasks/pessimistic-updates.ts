import { SubtaskResponse } from '@/types/data/subtask';
import { boardsApiSlice } from '../boards/endpoints';
import { Dispatch, SubtaskMutationQueryFulfilled } from './types';

async function markSubtask(
    queryFulfilled: SubtaskMutationQueryFulfilled<SubtaskResponse>,
    dispatch: Dispatch,
    subtaskId: string,
    boardId: string,
) {
    try {
        const { data } = await queryFulfilled;
        const { is_completed, task_id: taskId } = data;

        dispatch(
            boardsApiSlice.util.updateQueryData('getBoardDataById', boardId ?? '', draft => {
                const stageIdx = draft.stages?.findIndex(stage => stage.tasks?.some(task => task.id === taskId));
                const taskIdx = draft.stages[stageIdx].tasks?.findIndex(task => task.id === taskId);
                const subtaskIdx = draft.stages![stageIdx!].tasks![taskIdx!].subtasks.findIndex(
                    subtask => subtask.id === subtaskId,
                );

                draft.stages[stageIdx].tasks[taskIdx].subtasks[subtaskIdx].is_completed = is_completed;
            }),
        );
    } catch (err) {
        console.log(err);
        dispatch(boardsApiSlice.util.invalidateTags(['BoardData']));
    }
}

export const pessimisticUpdate = {
    markSubtask,
};
