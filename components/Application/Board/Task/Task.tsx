import { TaskModalProvider } from '@/services/context/task-modal/task-modal-context';
import { TaskState } from '@/services/context/task-modal/types';
import { TaskResponse } from '@/types/data/tasks';
import TaskCard from './TaskCard';
import TaskModal from './TaskModals/TaskModal';

type TaskProps = {
    task: TaskResponse;
    index: number;
};

const Task = ({ task, index }: TaskProps) => {
    const parsedTaskData: TaskState = {
        id: task.id,
        title: task.title,
        description: task.description,
        subtasks: task.subtasks,
        assignedUser: task.assigned_user,
        status: task.status,
        isFormSubmitted: false,
    };

    return (
        <TaskModalProvider taskData={parsedTaskData}>
            <TaskCard index={index} />
            <TaskModal />
        </TaskModalProvider>
    );
};

export default Task;
