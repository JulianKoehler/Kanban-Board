import WarningModal from '@/components/UI/Modal/WarningModal';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskModalType } from '@/services/context/task-modal/types';
import { restApi } from '@/services/redux/api';
import toast from 'react-hot-toast';

const TaskDeletion = () => {
    const [deleteTask, deleteResult] = restApi.tasks.useDeleteTaskMutation();
    const { taskData, activeModal, setActiveModal } = useTaskModalContext();
    const { id } = taskData;

    async function deleteCurrentTask() {
        const response = deleteTask(id).unwrap();

        toast.promise(response, {
            loading: 'Sending...',
            success: `Your task has been deleted`,
            error: () => `Could not delete your task: ${deleteResult.error}`,
        });

        await response;
        setActiveModal(null);
    }

    return (
        <WarningModal
            show={activeModal === TaskModalType.DELETION_WARNING}
            type="destructive"
            onClose={() => setActiveModal(TaskModalType.PRESENTATION)}
            onSubmit={deleteCurrentTask}
            isLoading={deleteResult.isLoading}>
            <WarningModal.Headline>Delete this task?</WarningModal.Headline>
            <WarningModal.Message>
                Are you sure you want to delete this task and its subtasks? This action cannot be reversed.
            </WarningModal.Message>
            <WarningModal.UserActionButtons submitLabel="Delete" cancelLabel="Cancel" />
        </WarningModal>
    );
};

export default TaskDeletion;
