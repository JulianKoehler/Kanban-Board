import { api } from './api';
import { authApiSlice } from './auth/endpoints';
import { boardsApiSlice } from './boards/endpoints';
import { stagesApiSlice } from './stages/endpoints';
import { subtasksApiSlice } from './subtasks/endpoints';
import { tasksApiSlice } from './tasks/endpoints';
import { usersApiSlice } from './users/endpoints';

export const restApi = {
    api: api,
    auth: authApiSlice,
    boards: boardsApiSlice,
    stages: stagesApiSlice,
    subtasks: subtasksApiSlice,
    tasks: tasksApiSlice,
    users: usersApiSlice,
};
