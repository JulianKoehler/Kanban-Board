import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveBoard } from '@/redux/slices/boardSlice';
import checkFormValidity from '@/util/checkFormValidity';
import Button from '@/components/UI/Button';
import Form from '@/components/UI/Formelements/Form';
import FormGroup from '@/components/UI/Formelements/FormGroup';
import H5 from '@/components/UI/Headings/H5';
import Input from '@/components/UI/InputFields/TextInput';
import GenericModalContainer from '@/components/UI/Modal/GenericModalContainer';
import { LoadingSpinner_TailSpin as TailSpin } from '@/components/UI/LoadingSpinner';
import StageInputArea from './StageInputArea';
import { restApi } from '@/redux/api';
import { BoardCreate, BoardDataResponse, BoardUpdate } from '@/types/data/board';
import { StageUpdate } from '@/types/data/stages';
import { selectUser } from '@/redux/slices/authSlice';
import { ContributorUpdate, UserInfoReturn } from '@/types/data/user';
import TeamMembers from './TeamMembers';

export type BoardModalProps = {
    onClose: () => void;
    showModal: boolean;
    board?: BoardDataResponse;
};

const BoardModal = ({ board, onClose, showModal }: BoardModalProps) => {
    const dispatch = useAppDispatch();
    const [createBoard, { isLoading: isCreatingBoard, isError: isErrorCreation }] =
        restApi.boards.useCreateBoardMutation();
    const [updateBoard, { isLoading: isUpdatingBoard, isError: ísErrorUpdate }] =
        restApi.boards.useUpdateBoardMutation();
    const [setBoardOwner, { isLoading: isUpdatingOwner, isError: isErrorOwnerUpdate }] =
        restApi.boards.useSetBoardOwnerMutation();
    const isLoading = isUpdatingBoard || isCreatingBoard;
    const isEditMode = !!board;
    const currentUser = useAppSelector(selectUser);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [boardTitle, setBoardTitle] = useState(isEditMode ? board.title : '');
    const [stages, setStages] = useState<StageUpdate[]>([]);
    const [contributors, setContributors] = useState<ContributorUpdate[]>(board?.contributors ?? []);
    const [owner, setOwner] = useState<UserInfoReturn>(
        board?.owner ?? currentUser ?? ({} as unknown as UserInfoReturn),
    );

    function handleAddContributor(user: ContributorUpdate) {
        if (user?.isNew) {
            setContributors(state => [...state, user]);
        } else {
            setContributors(state => {
                const currentState = [...state];
                const userIndex = currentState.findIndex(item => item.id === user.id);

                currentState[userIndex] = { ...user };

                return currentState;
            });
        }
    }

    function handleRemoveContributor(user: ContributorUpdate) {
        if (user?.isNew) {
            setContributors(state => state.filter(contributor => contributor.id !== user.id));
        }

        setContributors(state => {
            const currenState = [...state];

            const index = currenState.findIndex(contributor => contributor.id === user.id);
            currenState[index] = {
                ...currenState[index],
                markedForDeletion: true,
            };

            return currenState;
        });
    }

    async function handlePromoteToOwner(user: UserInfoReturn) {
        try {
            const response = setBoardOwner({ boardId: board!.id, userId: user.id }).unwrap();

            toast.promise(response, {
                loading: 'Sending...',
                success: `Board owner successfully updated!`,
                error: err => `Could not update owner: ${err?.data && err.data?.detail && err.data.detail}`,
            });

            if (isErrorOwnerUpdate) return;

            await response;

            setContributors(state => {
                const currentState = [...state].filter(contributor => contributor.id !== user.id);
                const newState = [owner, ...currentState];

                return newState;
            });

            setOwner(user);
        } catch (error) {
            console.error(error);
        }
    }

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
            owner: owner.id,
            contributors: contributors.map(user => ({
                id: user.id,
                isNew: user?.isNew,
                markedForDeletion: user?.markedForDeletion,
            })),
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
            error: err => `Could not create your board: ${JSON.stringify(err)}`,
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
        console.log(data.contributors);

        const response = updateBoard({ id, data }).unwrap();

        toast.promise(response, {
            loading: 'Sending...',
            success: `Your board has been updated!`,
            error: err => `Could not update your board: ${JSON.stringify(err)}`,
        });

        if (ísErrorUpdate) return;

        await response;
    }

    function initFormValues() {
        if (isEditMode) {
            setBoardTitle(board.title);
            setStages(board.stages);
            setOwner(board.owner);
            setContributors(board.contributors);
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
            setOwner(currentUser ?? ({} as unknown as UserInfoReturn));
            setContributors([]);
        }
        setIsFormSubmitted(false);
    }

    useEffect(() => {
        (!showModal || board) && initFormValues();
    }, [showModal, board, currentUser]);

    return (
        <GenericModalContainer
            isShowing={showModal}
            onClose={onClose}
            additionalClassNames="w-[48rem] max-h-[71rem] overflow-x-hidden"
        >
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
                    <H5>Stages</H5>
                    <StageInputArea stages={stages} setStages={setStages} isFormSubmitted={isFormSubmitted} />
                </FormGroup>
                <TeamMembers
                    owner={owner}
                    contributors={contributors}
                    isEditMode={isEditMode}
                    onAddContributor={handleAddContributor}
                    onRemoveContributor={handleRemoveContributor}
                    onPromoteToOwner={handlePromoteToOwner}
                />
                <Button type="submit" variant="primary" className="flex justify-center">
                    {isLoading ? TailSpin : isEditMode ? 'Save Changes' : 'Create Board'}
                </Button>
            </Form>
        </GenericModalContainer>
    );
};

export default BoardModal;
