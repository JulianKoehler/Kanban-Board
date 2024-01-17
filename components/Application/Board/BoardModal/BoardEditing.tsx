import Button from '@/components/UI/Button/Button';
import Form from '@/components/UI/Formelements/Form';
import { LoadingSpinner_TailSpin as TailSpin } from '@/components/UI/LoadingSpinner';
import GenericModalContainer from '@/components/UI/Modal/GenericModalContainer';
import { useBoardModalContext } from '@/services/context/board-modal/board-modal-context';
import { ActionTypes } from '@/services/context/board-modal/types';
import { restApi } from '@/services/redux/api';
import { BoardUpdate } from '@/types/data/board';
import checkFormValidity from '@/util/checkFormValidity';
import { useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';
import toast from 'react-hot-toast';
import { BoardModalProps } from './BoardModal';
import { useInitBoardModal } from './BoardModal.hooks';
import StageInputArea from './StageInputArea';
import TeamMembers from './TeamMembers';
import TitleInput from './TitleInput';
import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';

const BoardEditing = ({ showModal, onClose, initialBoard }: BoardModalProps) => {
    const { boardData, dispatchBoard } = useBoardModalContext();
    const { title, stages, contributors, owner } = boardData;
    const { currentBoardId } = useCurrentBoardIdContext();

    useInitBoardModal(dispatchBoard, showModal, initialBoard);

    const [updateBoard, { isLoading, isError }] = restApi.boards.useUpdateBoardMutation();

    async function submitUpdateRequest(e: FormEvent) {
        e.preventDefault();
        dispatchBoard({ type: ActionTypes.SET_IS_FORM_SUBMITTED, payload: true });

        const toBeValidated = [title];
        stages.forEach(stage => {
            if (!stage.markedForDeletion) {
                toBeValidated.push(stage.title);
            }
        });
        const isFormValid = checkFormValidity(toBeValidated);

        if (!isFormValid) return;

        const updatedBoardData: BoardUpdate = {
            title,
            stages,
            owner: owner.id,
            contributors: contributors.map(user => ({
                id: user.id,
                isNew: user?.isNew,
                markedForDeletion: user?.markedForDeletion,
            })),
        };
        const response = updateBoard({ id: currentBoardId, data: updatedBoardData }).unwrap();

        toast.promise(response, {
            loading: 'Sending...',
            success: `Your board has been updated!`,
            error: err => `Could not update your board: ${JSON.stringify(err)}`,
        });

        if (isError) return;

        await response;

        onClose();
    }
    return (
        <GenericModalContainer
            isShowing={showModal}
            onClose={onClose}
            className="max-h-[71rem] w-[48rem] overflow-x-hidden">
            <Form onSubmit={submitUpdateRequest}>
                <h2 className="text-xl font-bold">Edit Board</h2>
                <TitleInput />
                <StageInputArea />
                <TeamMembers isEditMode={false} />
                <Button type="submit" variant="primary" className="flex justify-center" disabled={isLoading}>
                    {isLoading ? TailSpin : 'Save changes'}
                </Button>
            </Form>
        </GenericModalContainer>
    );
};

export default BoardEditing;
