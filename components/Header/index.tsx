import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { selectActiveBoard } from '@/redux/slices/boardSlice';
import Image from 'next/image';
import LogoLightMode from '@/public/assets/logo-dark.svg';
import LogoDarkMode from '@/public/assets/logo-light.svg';
import LogoMobile from '@/public/assets/logo-mobile.svg';
import AddIcon from '@/public/assets/icon-add-task-mobile.svg';
import ArrowDown from '@/public/assets/icon-chevron-down.svg';
import ArrowUp from '@/public/assets/icon-chevron-up.svg';
import Button from '@/components/UI/Button';
import TaskModal from '../Board/Task/TaskModal';
import useViewport from '@/hooks/useViewport';
import MobileMenu from './MobileMenu';
import UserMenu from '../User/UserMenu';
import BoardMenu from '../Board/BoardMenu';
import { selectUser } from '@/redux/slices/authSlice';
import { restApi } from '@/redux/api';
import { ChangeEventHandler } from 'react';
import { BoardListItem } from '@/types/data/board';
import { cn } from '@/util/combineStyles';

export type HeaderProps = {
    children?: React.ReactNode;
    showSidebar: boolean;
    theme: string;
    setTheme: Dispatch<SetStateAction<string>> & ChangeEventHandler<HTMLInputElement>;
    setIsMobile: (isMobile: boolean) => void;
    onToggleMobileMenu: () => void;
    showMobileMenu: boolean;
    boardList: BoardListItem[] | undefined;
    isLoadingBoardList: boolean;
    isSuccessBoardList: boolean;
};

const Header = ({
    children,
    showSidebar,
    showMobileMenu,
    onToggleMobileMenu,
    theme,
    setTheme,
    setIsMobile,
    isSuccessBoardList,
}: HeaderProps) => {
    const activeBoard = useAppSelector(selectActiveBoard);
    const [getBoardData, { data: board, isFetching: isFetchingBoardData }] =
        restApi.boards.useLazyGetBoardDataByIdQuery();
    const user = useAppSelector(selectUser);
    const [showAddNewTaskModal, setShowAddNewTaskModal] = useState(false);
    const stagesExist = board?.stages && board?.stages?.length > 0;
    const [isMobile, isTablet] = useViewport();
    const maxLengthBoardName = 30;

    useEffect(() => {
        setIsMobile(isMobile);
    }, [isMobile]);

    useEffect(() => {
        activeBoard && getBoardData(activeBoard.id);
    }, [activeBoard]);

    function onAddNewTask() {
        setShowAddNewTaskModal(true);
    }

    function onCloseNewTask() {
        setShowAddNewTaskModal(false);
    }

    return (
        <>
            <header
                className={cn(
                    isMobile ? 'h-[6.4rem]' : 'h-[9.6rem]',
                    'flex max-w-[100%] items-center justify-start gap-8 border-b border-lines-light bg-white pl-[1.6rem] pr-[0.6rem] dark:border-lines-dark dark:bg-grey-dark tablet:pl-[2.4rem] tablet:pr-[2.2rem]',
                )}
            >
                {!showSidebar && !isMobile && (
                    <div className="flex h-full items-center border-r-[0.1rem] border-lines-light pr-[3.2rem] dark:border-lines-dark">
                        <Image src={theme === 'dark' ? LogoDarkMode : LogoLightMode} alt="kanban-logo" />
                    </div>
                )}
                {isMobile && (
                    <div className="mr-[1.6rem]">
                        <Image src={LogoMobile} alt="kanban-logo" />
                    </div>
                )}
                <h1
                    className={`font-bold ${isMobile ? 'text-xl' : isTablet ? 'text-[2rem]' : 'text-2xl'} ${
                        !showSidebar && !isTablet && !isMobile && 'ml-[3.2rem]'
                    } ${!showSidebar && isTablet && 'ml-[2.4rem]'}`}
                >
                    {board?.title.slice(0, maxLengthBoardName) || ''}
                    {board?.title && board?.title.length > maxLengthBoardName ? '...' : ''}
                </h1>
                {isMobile && (
                    <button
                        className={`flex items-center justify-center p-[0.9rem] ${showMobileMenu ? '' : 'mt-[0.5rem]'}`}
                        onClick={onToggleMobileMenu}
                    >
                        <Image src={showMobileMenu ? ArrowUp : ArrowDown} alt="Open board manager" />
                    </button>
                )}
                <div className="relative ml-auto flex min-w-fit items-center gap-[1rem]">
                    {!!activeBoard && (
                        <Button
                            large
                            variant="primary"
                            className={isMobile ? 'px-[1.8rem] py-[1rem]' : 'px-[2.4rem]'}
                            onClick={onAddNewTask}
                            disabled={!stagesExist || isFetchingBoardData}
                        >
                            {isMobile ? <Image src={AddIcon} alt="add" /> : '+Add New Task'}
                        </Button>
                    )}
                    {activeBoard && <BoardMenu />}
                    {user && <UserMenu />}
                </div>
            </header>
            <TaskModal
                key={board?.id}
                showModal={showAddNewTaskModal}
                statusOptions={board?.stages!}
                onClose={onCloseNewTask}
            />

            <MobileMenu
                showModal={isMobile && showMobileMenu}
                theme={theme}
                setTheme={setTheme}
                onClose={onToggleMobileMenu}
            >
                {children}
            </MobileMenu>
        </>
    );
};

export default Header;
