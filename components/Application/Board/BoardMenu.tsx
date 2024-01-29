import MenuActionButton from '@/components/UI/Button/Menu/MenuActionButton';
import MenuToggleButton from '@/components/UI/Button/Menu/MenuToggleButton';
import DropdownContainer from '@/components/UI/Dropdown/DropdownContainer';
import WarningModal from '@/components/UI/Modal/WarningModal';
import useGetBoardData from '@/hooks/useGetBoardData';
import useMenuHandler from '@/hooks/useMenuHandler';
import OptionsIcon from '@/public/assets/icon-vertical-ellipsis.svg';
import { BoardState } from '@/services/context/board-modal/types';
import { restApi } from '@/services/redux/api';
import { useAppDispatch } from '@/services/redux/hooks';
import { setActiveBoard } from '@/services/redux/slices/boardSlice';
import { StageUpdate } from '@/types/data/stages';
import { ContributorUpdate, UserInfoReturn } from '@/types/data/user';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import BoardModal from './BoardModal/BoardModal';
import { isErrorWithMessageFromBackend } from '@/types/type-guards/errors';
import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';

const BoardMenu = () => {
    const dispatch = useAppDispatch();
    const { replace } = useRouter();
    const boardMenuRef = useRef<HTMLDivElement>(null);
    const { showElement: showBoardMenu, setShowElement: setShowBoardMenu } = useMenuHandler(boardMenuRef);
    const [showEditBoardModal, setShowEditBoardModal] = useState(false);
    const [showDeleteBoardWarning, setShowDeleteBoardWarning] = useState(false);

    const { currentBoardId } = useCurrentBoardIdContext();
    const { data: board, isFetching, isError } = useGetBoardData();
    const [deleteBoard, boardDeletion] = restApi.boards.useDeleteBoardMutation();

    const parsedBoard: BoardState = {
        title: board?.title ?? '',
        stages: board?.stages ?? ([] as StageUpdate[]),
        contributors: board?.contributors ?? ([] as ContributorUpdate[]),
        owner: board?.owner ?? ({} as UserInfoReturn),
        isFormSubmitted: false,
    };

    function handleEditCurrentBoard() {
        setShowEditBoardModal(true);
        setShowBoardMenu(false);
    }

    function handleDeleteCurrentBoard() {
        setShowDeleteBoardWarning(true);
        setShowBoardMenu(false);
    }

    async function deleteCurrentBoard() {
        const response = deleteBoard(currentBoardId ?? '').unwrap();

        toast.promise(response, {
            loading: 'Sending...',
            success: `Your board has been deleted`,
            error: err => {
                if (isErrorWithMessageFromBackend(err)) {
                    return err.data.detail;
                }
                return `Something went wrong. You board could not be deleted!`;
            },
        });

        await response;

        setShowDeleteBoardWarning(false);
        dispatch(setActiveBoard(undefined));
        replace('/board');
    }

    return (
        <>
            <div id="menu-dropdown" ref={boardMenuRef}>
                <MenuToggleButton
                    onClick={() => setShowBoardMenu(prevState => !prevState)}
                    disabled={isFetching || isError}
                    className="rounded-full p-[1rem] transition-all hover:bg-gray-200 disabled:cursor-not-allowed">
                    <Image src={OptionsIcon} alt="options" />
                </MenuToggleButton>
                <DropdownContainer className="absolute right-0 top-[6rem]" show={showBoardMenu}>
                    <MenuActionButton onClick={handleEditCurrentBoard} className="rounded-t-xl">
                        Edit Board
                    </MenuActionButton>

                    <MenuActionButton
                        onClick={handleDeleteCurrentBoard}
                        className="rounded-b-xl pb-[1.6rem] pt-[0.8rem] text-red">
                        Delete Board
                    </MenuActionButton>
                </DropdownContainer>
            </div>

            <BoardModal
                showModal={showEditBoardModal}
                initialBoard={parsedBoard}
                onClose={() => setShowEditBoardModal(false)}
            />
            <WarningModal
                show={showDeleteBoardWarning}
                type="destructive"
                onClose={() => setShowDeleteBoardWarning(false)}
                onSubmit={deleteCurrentBoard}
                isLoading={boardDeletion.isLoading}>
                <WarningModal.Headline>Delete this Board?</WarningModal.Headline>
                <WarningModal.Message>
                    Are you sure you want to delete this board? This action will remove all stages and tasks as well and
                    cannot be undone.
                </WarningModal.Message>
                <WarningModal.UserActionButtons submitLabel="Delete" cancelLabel="Cancel" />
            </WarningModal>
        </>
    );
};

export default BoardMenu;
