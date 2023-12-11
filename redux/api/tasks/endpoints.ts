import { TaskCreate, TaskDeleteResponse, TaskResponse, TaskStageUpdate, TaskUpdate } from '@/types/data/tasks';
import { api } from '../api';
import { pessimisticUpdate } from './pessimistic-updates';

export const tasksApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        createTask: builder.mutation<TaskResponse, TaskCreate>({
            query: ({ boardId, stageId, subtasks, ...props }) => ({
                url: 'tasks/',
                method: 'POST',
                body: {
                    board_id: boardId,
                    stage_id: stageId,
                    subtasks: subtasks.map(subtask => {
                        const { isNew, ...rest } = subtask
                        return {
                            ...rest,
                            is_new: isNew,
                        };
                    }),
                    ...props,
                },
            }),
            async onQueryStarted(task, { dispatch, queryFulfilled }) {
                pessimisticUpdate.createTask(queryFulfilled, dispatch, task);
            },
        }),
        updateTask: builder.mutation<TaskResponse, { id: string; task: TaskUpdate }>({
            query: ({ id, task: { boardId, stageId, prevStageId, subtasks, ...props } }) => ({
                url: `tasks/${id}`,
                method: 'PUT',
                body: {
                    board_id: boardId,
                    stage_id: stageId,
                    subtasks: subtasks.map(subtask => {
                        const { isNew, ...rest } = subtask
                        return {
                            ...rest,
                            is_new: isNew,
                        };
                    }),
                    ...props,
                },
            }),
            async onQueryStarted({ id, task }, { dispatch, queryFulfilled }) {
                pessimisticUpdate.updateTask(queryFulfilled, dispatch, task, id);
            },
        }),
        updateStage: builder.mutation<TaskResponse, TaskStageUpdate>({
            query: ({ taskId, newStageId }) => ({
                url: `tasks/${taskId}`,
                method: 'PATCH',
                body: { new_stage_id: newStageId },
            }),
            async onQueryStarted({ taskId, prevStageId, newStageId, boardId }, { dispatch, queryFulfilled }) {
                pessimisticUpdate.updateStage(queryFulfilled, dispatch, boardId, taskId, prevStageId, newStageId);
            },
        }),
        deleteTask: builder.mutation<TaskDeleteResponse, string>({
            query: id => ({
                url: `tasks/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                pessimisticUpdate.deleteTask(queryFulfilled, dispatch, id);
            },
        }),
    }),
});
