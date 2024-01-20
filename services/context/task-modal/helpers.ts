import { Dispatch } from 'react';
import { TaskActionTypes, Actions, TaskState } from './types';
import { Subtask } from '@/types/data/subtask';

export function initFormValues(dispatch: Dispatch<Actions>, taskData: TaskState | undefined) {
    if (!!taskData) {
        dispatch({ type: TaskActionTypes.SET_INITIAL_TITLE, payload: { title: taskData.title } });
        dispatch({ type: TaskActionTypes.SET_DESCRIPTION, payload: { content: taskData.description } });
        dispatch({
            type: TaskActionTypes.SET_SUBTASKS,
            payload: { subtasks: taskData.subtasks },
        });
        dispatch({ type: TaskActionTypes.SET_ASSIGNED_USER, payload: { user: taskData.assignedUser } });
        dispatch({ type: TaskActionTypes.SET_STATUS, payload: { status: taskData.status } });
    } else {
        dispatch({ type: TaskActionTypes.SET_INITIAL_TITLE, payload: { title: '' } });
        dispatch({ type: TaskActionTypes.SET_DESCRIPTION, payload: { content: '' } });
        dispatch({
            type: TaskActionTypes.SET_SUBTASKS,
            payload: { subtasks: [] as Subtask[] },
        });
        dispatch({ type: TaskActionTypes.SET_ASSIGNED_USER, payload: { user: null } });
        dispatch({ type: TaskActionTypes.SET_STATUS, payload: { status: { id: '', title: '' } } });
    }
    dispatch({ type: TaskActionTypes.SET_IS_FORM_SUBMITTED, payload: false });
}

export function emptyFormValues(dispatch: Dispatch<Actions>) {
    dispatch({ type: TaskActionTypes.SET_INITIAL_TITLE, payload: { title: '' } });
    dispatch({ type: TaskActionTypes.SET_DESCRIPTION, payload: { content: '' } });
    dispatch({
        type: TaskActionTypes.SET_SUBTASKS,
        payload: { subtasks: [] as Subtask[] },
    });
    dispatch({ type: TaskActionTypes.SET_ASSIGNED_USER, payload: { user: null } });
    dispatch({ type: TaskActionTypes.SET_STATUS, payload: { status: { id: '', title: '' } } });
    dispatch({ type: TaskActionTypes.SET_IS_FORM_SUBMITTED, payload: false });
}
