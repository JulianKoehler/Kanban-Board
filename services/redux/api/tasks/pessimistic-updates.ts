import { TaskCreate, TaskDeleteResponse, TaskResponse, TaskUpdate } from '@/types/data/tasks';
import { boardsApiSlice } from '../boards/endpoints';
import { Dispatch, TaskMutationQueryFulfilled } from './types';

async function createTask(
    queryFulfilled: TaskMutationQueryFulfilled<TaskResponse>,
    dispatch: Dispatch,
    task: TaskCreate,
) {
    try {
        const { data } = await queryFulfilled;
        dispatch(
            boardsApiSlice.util.updateQueryData('getBoardDataById', task.boardId, draft => {
                const stageIndex = draft.stages.findIndex(stage => stage.id === task.stageId);
                draft.stages[stageIndex!].tasks.push(data);
            }),
        );
    } catch (err) {
        console.log(err);
        dispatch(boardsApiSlice.util.invalidateTags(['BoardData']));
    }
}

async function updateTask( 
    queryFulfilled: TaskMutationQueryFulfilled<TaskResponse>,
    dispatch: Dispatch,
    task: TaskUpdate,
    id: string,
) {
    try {
        const { data } = await queryFulfilled;
        dispatch(
            boardsApiSlice.util.updateQueryData('getBoardDataById', task.boardId, draft => {
                const hasStageChanged = task.stageId !== task?.prevStageId;
                const prevStageIndex = draft.stages.findIndex(stage => stage.id === task?.prevStageId);
                const newStageIndex = draft.stages.findIndex(stage => stage.id === task.stageId);

                if (prevStageIndex < 0 || newStageIndex < 0) {
                    throw new Error(
                        `A stage wasn't found. PrevStageIndex: ${prevStageIndex}, newStageIndex: ${newStageIndex}`,
                    );
                }

                if (hasStageChanged) {
                    draft.stages[prevStageIndex].tasks = draft.stages[prevStageIndex].tasks?.filter(
                        task => task.id !== id,
                    );

                    draft.stages[newStageIndex].tasks.push(data);
                } else {
                    const indexOfUpdatedTask = draft.stages[newStageIndex].tasks.findIndex(task => task.id === id);
                    draft.stages[newStageIndex].tasks[indexOfUpdatedTask] = data;
                }
            }),
        );
    } catch (err) {
        console.log(err);
        dispatch(boardsApiSlice.util.invalidateTags(['BoardData']));
    }
}

async function deleteTask(
    queryFulfilled: TaskMutationQueryFulfilled<TaskDeleteResponse>,
    dispatch: Dispatch,
    id: string,
) {
    try {
        const {
            data: { board_id: boardId, stage_id: stageId },
        } = await queryFulfilled;

        dispatch(
            boardsApiSlice.util.updateQueryData('getBoardDataById', boardId, draft => {
                const stageIndex = draft?.stages?.findIndex(stage => stage.id === stageId);
                if (stageIndex === undefined) throw new Error('No stage found for this task.');

                draft.stages[stageIndex].tasks = draft.stages[stageIndex].tasks.filter(task => task.id !== id);
            }),
        );
    } catch (err) {
        console.log(err);
        dispatch(boardsApiSlice.util.invalidateTags(['BoardData']));
    }
}

async function updateAssingedUser(
    queryFulfilled: TaskMutationQueryFulfilled<TaskResponse>,
    dispatch: Dispatch,
    boardId: string,
) {
    try {
        const { data } = await queryFulfilled;

        dispatch(
            boardsApiSlice.util.updateQueryData('getBoardDataById', boardId, draft => {
                const stageIndex = draft?.stages?.findIndex(stage => stage.id === data.status.id);
                if (stageIndex === undefined) throw new Error('No stage found for this task.');

                const taskIndex = draft?.stages[stageIndex].tasks.findIndex(task => task.id === data.id);
                if (taskIndex === undefined) throw new Error('This task does not exist');

                draft.stages[stageIndex].tasks[taskIndex].assigned_user = data.assigned_user;
            }),
        );
    } catch (err) {
        console.log(err);
        dispatch(boardsApiSlice.util.invalidateTags(['BoardData']));
    }
}

export const pessimisticUpdate = {
    createTask,
    updateTask,
    deleteTask,
    updateAssingedUser,
};
