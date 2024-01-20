import { ActionTypeException } from '@/lib/exceptions';
import { TaskActionTypes, Actions, TaskState } from './types';
import toast from 'react-hot-toast';

export const taskReducer = (state: TaskState, action: Actions): TaskState => {
    switch (action.type) {
        case TaskActionTypes.SET_TITLE: {
            const { event } = action.payload;
            if (
                event.target.value.length > 100 &&
                // @ts-ignore
                event.nativeEvent.inputType !== 'deleteContentBackward'
            ) {
                toast('Consider putting the details into the description', {
                    icon: '🚫',
                    id: state.id,
                });
                return state;
            }

            return { ...state, title: event.target.value };
        }

        case TaskActionTypes.SET_INITIAL_TITLE:
            return { ...state, title: action.payload.title };

        case TaskActionTypes.SET_DESCRIPTION: {
            return { ...state, description: action.payload.content };
        }

        case TaskActionTypes.SET_SUBTASKS: {
            return { ...state, subtasks: action.payload.subtasks };
        }

        case TaskActionTypes.SET_ASSIGNED_USER:
            return { ...state, assignedUser: action.payload.user };

        case TaskActionTypes.SET_STATUS: {
            return { ...state, status: action.payload.status };
        }

        case TaskActionTypes.TOGGLE_SUBTASK: {
            const { index } = action.payload;
            const newSubtasks = [...state.subtasks];

            newSubtasks[index] = { ...newSubtasks[index], is_completed: !newSubtasks[index].is_completed };

            return { ...state, subtasks: newSubtasks };
        }

        case TaskActionTypes.SET_SUBTASK_TITLE: {
            const { index, title } = action.payload;
            const newSubtasks = [...state.subtasks];

            newSubtasks[index] = {
                ...newSubtasks[index],
                title,
            };

            return { ...state, subtasks: newSubtasks };
        }

        case TaskActionTypes.ADD_SUBTASK: {
            // Id will be set after submit by Postgresql
            const newSubtask = {
                id: '',
                title: '',
                index: state.subtasks.length,
                is_completed: false,
                isNew: true,
            };

            return { ...state, subtasks: [...state.subtasks, newSubtask] };
        }

        case TaskActionTypes.DELETE_SUBTASK: {
            const { index } = action.payload;
            const newSubtasks = [...state.subtasks];

            newSubtasks[index] = {
                ...newSubtasks[index],
                markedForDeletion: true,
            };

            // Remove newly created subtasks directly in the frontend before submitting them to the API
            if (newSubtasks[index]?.isNew) {
                newSubtasks.splice(index, 1);
            }

            return { ...state, subtasks: newSubtasks };
        }

        case TaskActionTypes.SET_IS_FORM_SUBMITTED:
            return { ...state, isFormSubmitted: action.payload };

        default:
            throw new ActionTypeException<TaskActionTypes | string>([...Object.values(TaskActionTypes)]);
    }
};
