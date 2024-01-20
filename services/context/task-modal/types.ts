import { Status } from '@/types/data/stages';
import { Subtask } from '@/types/data/subtask';
import { UserInfoReturn } from '@/types/data/user';
import { ChangeEvent, Dispatch, ReactNode, SetStateAction } from 'react';

export type TaskState = {
    id: string;
    title: string;
    description: string;
    subtasks: Subtask[];
    assignedUser: UserInfoReturn | null;
    status: Status;
    isFormSubmitted: boolean;
};

export enum TaskModalType {
    PRESENTATION = 'PRESENTATION',
    CREATING = 'CREATING',
    EDITING = 'EDITING',
    DELETION_WARNING = 'DELETION_WARNING',
}

export type TaskModalProviderProps = {
    children: ReactNode;
    taskData?: TaskState;
};

export enum TaskActionTypes {
    SET_TITLE,
    SET_INITIAL_TITLE,
    SET_DESCRIPTION,
    SET_SUBTASKS,
    SET_ASSIGNED_USER,
    SET_STATUS,
    SET_SUBTASK_TITLE,
    TOGGLE_SUBTASK,
    ADD_SUBTASK,
    DELETE_SUBTASK,
    SET_IS_FORM_SUBMITTED,
}

export type Actions =
    | {
          type: TaskActionTypes.SET_TITLE;
          payload: { event: ChangeEvent<HTMLInputElement> };
      }
    | {
          type: TaskActionTypes.SET_INITIAL_TITLE;
          payload: { title: string };
      }
    | {
          type: TaskActionTypes.SET_DESCRIPTION;
          payload: { content: string };
      }
    | {
          type: TaskActionTypes.SET_SUBTASKS;
          payload: { subtasks: Subtask[] };
      }
    | {
          type: TaskActionTypes.SET_ASSIGNED_USER;
          payload: { user: UserInfoReturn | null };
      }
    | {
          type: TaskActionTypes.SET_STATUS;
          payload: { status: Status };
      }
    | {
          type: TaskActionTypes.SET_SUBTASK_TITLE;
          payload: { title: string; index: number };
      }
    | {
          type: TaskActionTypes.TOGGLE_SUBTASK;
          payload: { index: number };
      }
    | {
          type: TaskActionTypes.ADD_SUBTASK;
      }
    | {
          type: TaskActionTypes.DELETE_SUBTASK;
          payload: { index: number };
      }
    | {
          type: TaskActionTypes.SET_IS_FORM_SUBMITTED;
          payload: boolean;
      };

export type TaskModalContextProps = {
    taskData: TaskState;
    dispatchTask: Dispatch<Actions>;
    activeModal: keyof typeof TaskModalType | null;
    setActiveModal: Dispatch<SetStateAction<keyof typeof TaskModalType | null>>;
};
