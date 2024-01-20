import { ContextException } from '@/lib/exceptions';
import { createContext, useContext, useReducer, useState } from 'react';
import { TaskModalContextProps, TaskModalProviderProps, TaskState, TaskModalType } from './types';
import { taskReducer } from './taskReducer';

export const TaskModalContext = createContext<TaskModalContextProps | undefined>(undefined);

// Owner will be set in the Provider from Redux user state
const initialState: TaskState = {
    id: '',
    title: '',
    description: '',
    subtasks: [],
    assignedUser: null,
    status: { id: '', title: '' },
    isFormSubmitted: false,
};

export const TaskModalProvider = ({ children, taskData }: TaskModalProviderProps) => {
    const [taskState, dispatchTask] = useReducer(taskReducer, taskData ?? { ...initialState });
    const [activeModal, setActiveModal] = useState<keyof typeof TaskModalType | null>(null);

    return (
        <TaskModalContext.Provider value={{ taskData: taskState, dispatchTask, activeModal, setActiveModal }}>
            {children}
        </TaskModalContext.Provider>
    );
};

export const useTaskModalContext = () => {
    const context = useContext(TaskModalContext);
    const contextName = 'TaskContext';
    const providerName = 'TaskModalProvider';

    if (!context) {
        throw new ContextException(contextName, providerName);
    }

    return context;
};
