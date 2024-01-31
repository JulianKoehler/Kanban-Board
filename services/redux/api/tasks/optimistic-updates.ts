import { TaskResponse } from '@/types/data/tasks';
import { Dispatch, TaskMutationQueryFulfilled } from './types';
import { boardsApiSlice } from '../boards/endpoints';

async function updateStage(
    queryFulfilled: TaskMutationQueryFulfilled<TaskResponse>,
    dispatch: Dispatch,
    boardId: string,
    taskId: string,
    prevStageId: string,
    newStageId: string,
) {
    try {
        dispatch(
            boardsApiSlice.util.updateQueryData('getBoardDataById', boardId, draft => {
                const currentStageIndex = draft.stages.findIndex(stage => stage.id === prevStageId);
                const newStageIndex = draft.stages.findIndex(stage => stage.id === newStageId);

                const taskData = draft.stages[currentStageIndex].tasks.find(task => task.id === taskId);

                if (!taskData) {
                    throw new Error('Unable to update your task');
                }

                taskData.status = { id: newStageId, title: draft.stages[newStageIndex].title };

                draft.stages[currentStageIndex].tasks = draft.stages[currentStageIndex].tasks?.filter(
                    task => task.id !== taskId,
                );
                draft.stages[newStageIndex].tasks.push(taskData);
            }),
        );
        await queryFulfilled;
    } catch (err) {
        console.log(err);
        dispatch(boardsApiSlice.util.invalidateTags(['BoardData']));
    }
}

export const optimisticUpdates = {
    updateStage,
};
