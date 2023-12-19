import React, { useState, useEffect, ChangeEvent } from 'react';
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
import StageInputArea from './StageInputArea';
import { restApi } from '@/redux/api';
import { BoardCreate, BoardDataResponse, BoardUpdate } from '@/types/data/board';
import { StageUpdate } from '@/types/data/stages';
import Badge from '../UI/Badge';
import debounce from '@/util/debounce';
import DropDownContainer from '../UI/DropDown/DropDownContainer';
import DropDown from '../UI/DropDown/DropDown';

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
    const [searchUsers, userSearchResult] = restApi.users.useLazySearchAllUsersQuery();
    const isLoading = isUpdatingBoard || isCreatingBoard;
    const isEditMode = !!board;
    const [isAddingMembers, setIsAddingMembers] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [boardTitle, setBoardTitle] = useState(isEditMode ? board.title : '');
    const [stages, setStages] = useState<StageUpdate[]>([]);
    const boardOwner = board?.owner.first_name + ' ' + board?.owner.last_name;
    const userSearchResultDropdownOptions = userSearchResult.data?.map(user => ({
        id: user.id,
        title: `${user.first_name} ${user.last_name || ''}`
    }))

    async function handleUserSearch(e: ChangeEvent<HTMLInputElement>) {
        searchUsers(e.target.value);
    }

    const DEBOUNCE_INTERVAL = 500;
    const debouncedUserSearch = debounce(handleUserSearch, DEBOUNCE_INTERVAL);

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

    console.log(userSearchResult);

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
                    <H5>Stages</H5>
                    <StageInputArea stages={stages} setStages={setStages} isFormSubmitted={isFormSubmitted} />
                </FormGroup>
                <FormGroup additionalClasses='relative'>
                    <H5>Team members</H5>
                    <div className="flex items-center gap-3 p-2">
                        <span className="text-lg text-grey-dark">{boardOwner}</span>
                        <Badge userType="owner" />
                    </div>
                    {isAddingMembers && <Input onChange={debouncedUserSearch} />}
                    <DropDownContainer show={userSearchResult.isSuccess} additionalClassNames='bottom-0'>
                        {userSearchResult.data
                            ? userSearchResult.data.map(user => (
                                  <button
                                      onClick={() => {}}
                                      className="w-full rounded-t-xl px-[1.6rem] pb-[0.8rem] pt-[1.6rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                                  >
                                      {user.first_name} {user.last_name}
                                  </button>
                              ))
                            : null}
                    </DropDownContainer>
                    <Button variant="secondary" type="button" onClick={() => setIsAddingMembers(true)}>
                        + Add New Team Member
                    </Button>
                </FormGroup>
                <Button type="submit" variant="primary" className="flex justify-center">
                    {isLoading ? TailSpin : isEditMode ? 'Save Changes' : 'Create Board'}
                </Button>
            </Form>
        </GenericModalContainer>
    );
};

export default BoardModal;
