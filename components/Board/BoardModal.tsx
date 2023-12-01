import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/redux/hooks';
import { setActiveBoard } from '@/redux/slices/boardSlice';
import checkFormValidity from '@/util/checkFormValidity';
import Button from '@/components/UI/Button';
import Form from '@/components/UI/Formelements/Form';
import FormGroup from '@/components/UI/Formelements/FormGroup';
import H5 from '@/components/UI/Headings/H5';
import Input from '@/components/UI/InputFields/TextInput';
import GenericModalContainer from '@/components/UI/Modal/GenericModalContainer';
import { LoadingSpinner_TailSpin as TailSpin } from '@/components/UI/LoadingSpinner';
import StageInputArea from './StageInputField';
import { restApi } from '@/redux/api';

export type BoardModalProps = {
    onClose: () => void;
    showModal: boolean;
    board?: BoardDataResponse;
};

const BoardModal = ({ board, onClose, showModal }: BoardModalProps) => {
    const dispatch = useAppDispatch();
    const [updateBoard, { isLoading: isUpdatingBoard, isError: ísErrorUpdate }] =
        restApi.boards.useUpdateBoardMutation();
    const [createBoard, { isLoading: isCreatingBoard, isError: isErrorCreation }] =
        restApi.boards.useCreateBoardMutation();
    const isLoading = isUpdatingBoard || isCreatingBoard;
    const isEditMode = !!board;
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [boardTitle, setBoardTitle] = useState(isEditMode ? board.title : '');
    const [stages, setStages] = useState<StageUpdate[]>([]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsFormSubmitted(true);

        const toBeValidated = [boardTitle];
        stages.forEach(stage => {
            if (!stage.markedForDeletion) {
                toBeValidated.push(stage.title);
            }
        });
        const isFormValid = checkFormValidity(toBeValidated);

        if (!isFormValid) return;

        const newBoardData: BoardUpdate = {
            title: boardTitle,
            stages,
        };
        const taskId = isEditMode ? board.id : '';

        isEditMode ? submitUpdateRequest(taskId, newBoardData) : submitCreateRequest(newBoardData);

        onClose();
    }

    async function submitCreateRequest(data: BoardCreate) {
        const response = createBoard(data).unwrap();

        toast.promise(response, {
            loading: 'Sending...',
            success: `Your board has been created!`,
            error: err => `Could not create your board: ${err.toString()}`,
        });

        if (isErrorCreation) return;

        const newBoard = await response;

        dispatch(
            setActiveBoard({
                title: newBoard.title,
                id: newBoard?.id,
            }),
        );
    }

    async function submitUpdateRequest(id: string, data: BoardUpdate) {
        const response = updateBoard({ id, data }).unwrap();

        toast.promise(response, {
            loading: 'Sending...',
            success: `Your board has been updated!`,
            error: err => `Could not update your board: ${err.toString()}`,
        });

        if (ísErrorUpdate) return;

        await response;
    }

    function initFormValues() {
        if (isEditMode) {
            setBoardTitle(board.title);
            setStages(board.stages);
        } else {
            setBoardTitle('');
            setStages([
                {
                    id: '',
                    index: 0,
                    color: '#49C4E5',
                    title: '',
                },
            ]);
        }
        setIsFormSubmitted(false);
    }

    useEffect(() => {
        (!showModal || board) && initFormValues();
    }, [showModal, board]);

    return (
        <GenericModalContainer isShowing={showModal} onClose={onClose} additionalClassNames="w-[48rem] max-h-[71rem]">
            <Form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold">{isEditMode ? 'Edit Board' : 'Add New Board'}</h2>
                <FormGroup>
                    <H5>Name</H5>
                    <Input
                        className={isFormSubmitted && boardTitle.length < 1 ? 'input-error' : ''}
                        value={boardTitle}
                        onChange={e => setBoardTitle(e.target.value)}
                        placeholder="e.g. Web Design"
                    />
                    {isFormSubmitted && boardTitle.length < 1 && (
                        <p className="absolute bottom-[0.9rem] right-[1.6rem] text-base font-medium text-red">
                            Can't be empty
                        </p>
                    )}
                </FormGroup>
                <FormGroup className="flex flex-col gap-[1.6rem]">
                    <H5>Columns</H5>
                    <StageInputArea stages={stages} setStages={setStages} isFormSubmitted={isFormSubmitted} />
                </FormGroup>
                <Button type="submit" variant="primary" className="flex justify-center">
                    {isLoading ? TailSpin : isEditMode ? 'Save Changes' : 'Create Board'}
                </Button>
            </Form>
        </GenericModalContainer>
    );
};

export default BoardModal;
