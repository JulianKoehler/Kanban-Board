import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import useMenuHandler from '@/hooks/useMenuHandler';
import OptionsIcon from '@/public/assets/icon-vertical-ellipsis.svg';
import DropDownContainer from '@/components/UI/Dropdown/DropdownContainer';
import BoardModal from './BoardModal';
import DeletionWarning from '@/components/UI/Modal/DeletionWarning';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectActiveBoard, setActiveBoard } from '@/redux/slices/boardSlice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import MenuButton from '@/components/UI/Button/MenuButton';
import { restApi } from '@/redux/api';

const BoardMenu = () => {
    const dispatch = useAppDispatch();
    const boardMenuRef = useRef<HTMLDivElement>(null);
    const [showEditBoardModal, setShowEditBoardModal] = useState(false);
    const [showDeleteBoardWarning, setShowDeleteBoardWarning] = useState(false);
    const activeBoard = useAppSelector(selectActiveBoard);
    const { data: board, isFetching } = restApi.boards.useGetBoardDataByIdQuery(activeBoard?.id ?? skipToken);
    const [deleteBoard, boardDeletion] = restApi.boards.useDeleteBoardMutation();
    const { showElement: showBoardMenu, setShowElement: setShowBoardMenu } = useMenuHandler(boardMenuRef);

    function handleEditCurrentBoard() {
        setShowEditBoardModal(true);
        setShowBoardMenu(false)
    }

    function handleDeleteCurrentBoard() {
        setShowDeleteBoardWarning(true)
        setShowBoardMenu(false)
    }

    async function deleteCurrentBoard() {
        const response = deleteBoard(activeBoard?.id ?? '').unwrap();

        toast.promise(response, {
            loading: 'Sending...',
            success: `Your board has been deleted`,
            error: err => `Could not delete your board: ${err.toString()}`,
        });

        await response;

        setShowDeleteBoardWarning(false);
        dispatch(setActiveBoard(undefined));
    }

    return (
        <>
            <div id="menu-dropdown" ref={boardMenuRef}>
                <MenuButton
                    onClick={() => setShowBoardMenu(prevState => !prevState)}
                    disabled={isFetching}
                    className="rounded-full p-[1rem] transition-all hover:bg-gray-200 disabled:cursor-not-allowed"
                >
                    <Image src={OptionsIcon} alt="options" />
                </MenuButton>
                <DropDownContainer additionalClassNames="absolute right-0 top-[6rem]" show={showBoardMenu}>
                    <button
                        onClick={handleEditCurrentBoard}
                        className="w-full rounded-t-xl px-[1.6rem] pb-[0.8rem] pt-[1.6rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        Edit Board
                    </button>

                    <button
                        onClick={handleDeleteCurrentBoard}
                        className="rounded-b-xl px-[1.6rem] pb-[1.6rem] pt-[0.8rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        Delete Board
                    </button>
                </DropDownContainer>
            </div>
            <BoardModal showModal={showEditBoardModal} board={board} onClose={() => setShowEditBoardModal(false)} />

            <DeletionWarning
                show={showDeleteBoardWarning}
                title={board?.title ?? ''}
                type="board"
                onClose={() => setShowDeleteBoardWarning(false)}
                deleteFunction={deleteCurrentBoard}
                isLoading={boardDeletion.isLoading}
            />
        </>
    );
};

export default BoardMenu;
