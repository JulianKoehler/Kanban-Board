import TaskPresentation from './Presentation/TaskPresentation';
import TaskEditing from './TaskEditing/TaskEditing';
import TaskDeletion from './TaskDeletion/TaskDeletion';

const TaskModal = () => {
    /**
     * There is always only one Modal active.
     * Which one is controlled centrally via context 'TaskModalContext'.
     * This architecture ensures there are no overlapping Modals at the same time.
     * The TaskCreation has to be seperated though since it is a different context.
     */
    return (
        <>
            <TaskPresentation />
            <TaskEditing />
            <TaskDeletion />
        </>
    );
};

export default TaskModal;
