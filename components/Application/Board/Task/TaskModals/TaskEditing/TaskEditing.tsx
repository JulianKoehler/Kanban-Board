import Button from '@/components/UI/Button/Button';
import Form from '@/components/UI/Formelements/Form';
import { LoadingSpinner_TailSpin as TailSpin } from '@/components/UI/LoadingSpinner';
import GenericModalContainer from '@/components/UI/Modal/GenericModalContainer';
import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskActionTypes, TaskModalType } from '@/services/context/task-modal/types';
import { restApi } from '@/services/redux/api';
import { TaskUpdate } from '@/types/data/tasks';
import { UserInfoReturn } from '@/types/data/user';
import checkFormValidity from '@/util/checkFormValidity';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import SubtaskInputArea from '../../../Subtask/SubtaskInputArea';
import DescriptionEditor from '../DescriptionEditor';
import ShallowStatusChanger from '../ShallowStatusChanger';
import ShallowUserAssignment from '../ShallowUserAssignment';
import TitleEditor from '../TitleEditor';
import { useInitialStatus } from './TaskEditing.hooks';

const TaskCreating = () => {
    const { activeModal, setActiveModal, dispatchTask, taskData } = useTaskModalContext();
    const { title, description, subtasks, assignedUser, status, id } = taskData;

    const { currentBoardId } = useCurrentBoardIdContext();
    const [updateTask, updateResult] = restApi.tasks.useUpdateTaskMutation();
    const { data: board } = restApi.boards.useGetBoardDataByIdQuery(currentBoardId ?? skipToken);

    const teamMembers = [board?.owner, ...(board?.contributors ?? [])] as UserInfoReturn[];
    const initialStatus = useInitialStatus();

    useEffect(() => {
        updateResult.isSuccess && onClose();
    }, [updateResult.isSuccess]);

    if (!board) {
        console.debug({ board });
        return null;
    }

    function onClose() {
        setActiveModal(null);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        dispatchTask({ type: TaskActionTypes.SET_IS_FORM_SUBMITTED, payload: true });

        const toBeValidated = [title];
        subtasks.forEach(subtask => {
            if (!subtask.markedForDeletion) {
                toBeValidated.push(subtask.title);
            }
        });
        const isFormValid = checkFormValidity(toBeValidated);
        if (!isFormValid) return;

        const newTask: TaskUpdate = {
            stageId: status.id,
            prevStageId: initialStatus?.id,
            boardId: currentBoardId,
            title,
            description,
            assignedUserId: assignedUser?.id ?? null,
            subtasks,
        };

        const response = updateTask({ id, task: newTask }).unwrap();
        toast.promise(response, {
            loading: 'Updating your task...',
            success: 'Your task has been updated!',
            error: () => `Your task could not be updated: ${updateResult.error}`,
        });

        await response;
    }

    return (
        <GenericModalContainer isShowing={activeModal === TaskModalType.EDITING} className="max-h-[71rem] w-[48rem]">
            <Form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold">Edit Task</h2>
                <TitleEditor />
                <DescriptionEditor />
                <SubtaskInputArea />
                <ShallowUserAssignment users={teamMembers} />
                <ShallowStatusChanger statusOptions={board.stages} />
                <div className="flex gap-4">
                    <Button type="submit" variant="primary" className="flex justify-center">
                        {updateResult.isLoading ? TailSpin : 'Save Changes'}
                    </Button>
                    <Button onClick={onClose} type="button" variant="secondary">
                        Cancel
                    </Button>
                </div>
            </Form>
        </GenericModalContainer>
    );
};

export default TaskCreating;
