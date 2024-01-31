import {
    TaskCreate,
    TaskDeleteResponse,
    TaskResponse,
    TaskStageUpdate,
    TaskUpdate,
    TaskUpdateAssignedUser,
} from '@/types/data/tasks';
import { api } from '../api';
import { pessimisticUpdate } from './pessimistic-updates';
import { optimisticUpdates } from './optimistic-updates';

export const tasksApiSlice = api.injectEndpoints({
    endpoints: builder => ({
        createTask: builder.mutation<TaskResponse, TaskCreate>({
            query: ({ boardId, stageId, subtasks, assignedUserId, ...props }) => ({
                url: 'tasks/',
                method: 'POST',
                body: {
                    board_id: boardId,
                    stage_id: stageId,
                    assigned_user_id: assignedUserId,
                    subtasks: subtasks.map(subtask => {
                        const { isNew, ...rest } = subtask;
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
            query: ({ id, task: { boardId, stageId, subtasks, assignedUserId, ...props } }) => ({
                url: `tasks/${id}`,
                method: 'PUT',
                body: {
                    board_id: boardId,
                    stage_id: stageId,
                    assigned_user_id: assignedUserId,
                    subtasks: subtasks.map(subtask => {
                        const { isNew, ...rest } = subtask;
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
                url: `tasks/stage/${taskId}`,
                method: 'PATCH',
                body: { new_stage_id: newStageId },
            }),
            async onQueryStarted({ taskId, prevStageId, newStageId, boardId }, { dispatch, queryFulfilled }) {
                optimisticUpdates.updateStage(queryFulfilled, dispatch, boardId, taskId, prevStageId, newStageId);
            },
        }),
        updateAssingedUser: builder.mutation<TaskResponse, TaskUpdateAssignedUser>({
            query: ({ taskId, assignedUserId }) => ({
                url: `tasks/assignment/${taskId}`,
                method: 'PATCH',
                body: { assigned_user_id: assignedUserId },
            }),
            async onQueryStarted({ boardId }, { dispatch, queryFulfilled }) {
                pessimisticUpdate.updateAssingedUser(queryFulfilled, dispatch, boardId);
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
