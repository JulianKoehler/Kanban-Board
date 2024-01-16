import Button from '@/components/UI/Button/Button';
import Form from '@/components/UI/Formelements/Form';
import { LoadingSpinner_TailSpin as TailSpin } from '@/components/UI/LoadingSpinner';
import GenericModalContainer from '@/components/UI/Modal/GenericModalContainer';
import useQueryString from '@/hooks/useQueryString';
import { useBoardModalContext } from '@/services/context/board-modal/board-modal-context';
import { ActionTypes } from '@/services/context/board-modal/types';
import { restApi } from '@/services/redux/api';
import { useAppDispatch } from '@/services/redux/hooks';
import { setActiveBoard } from '@/services/redux/slices/boardSlice';
import { BoardUpdate } from '@/types/data/board';
import checkFormValidity from '@/util/checkFormValidity';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import toast from 'react-hot-toast';
import { BoardModalProps } from './BoardModal';
import { useInitBoardModal } from './BoardModal.hooks';
import StageInputArea from './StageInputArea';
import TeamMembers from './TeamMembers';
import TitleInput from './TitleInput';

const BoardCreation = ({ showModal, onClose }: BoardModalProps) => {
    const dispatch = useAppDispatch();
    const { push } = useRouter();
    const pathname = usePathname();
    const createQueryString = useQueryString();

    const { boardData, dispatchBoard } = useBoardModalContext();
    const { title, stages, contributors, owner } = boardData;    

    useInitBoardModal(dispatchBoard, showModal);

    const [createBoard, { isLoading, isError }] = restApi.boards.useCreateBoardMutation();

    async function submitCreateRequest(e: FormEvent) {
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

        const newBoardData: BoardUpdate = {
            title,
            stages,
            owner: owner.id,
            contributors: contributors.map(user => ({
                id: user.id,
                isNew: user?.isNew,
                markedForDeletion: user?.markedForDeletion,
            })),
        };

        const response = createBoard(newBoardData).unwrap();

        toast.promise(response, {
            loading: 'Sending...',
            success: `Your board has been created!`,
            error: err => `Could not create your board: ${JSON.stringify(err)}`,
        });

        if (isError) return;

        const newBoard = await response;

        dispatch(
            setActiveBoard({
                title: newBoard.title,
                id: newBoard.id,
            }),
        );
        push(pathname + '?' + createQueryString('id', newBoard.id));
        onClose();
    }

    return (
        <GenericModalContainer
            isShowing={showModal}
            onClose={onClose}
            className="max-h-[71rem] w-[48rem] overflow-x-hidden">
            <Form onSubmit={submitCreateRequest}>
                <h2 className="text-xl font-bold">Add New Board</h2>
                <TitleInput />
                <StageInputArea />
                <TeamMembers isEditMode={false} />
                <Button type="submit" variant="primary" className="flex justify-center" disabled={isLoading}>
                    {isLoading ? TailSpin : 'Create Board'}
                </Button>
            </Form>
        </GenericModalContainer>
    );
};

export default BoardCreation;
