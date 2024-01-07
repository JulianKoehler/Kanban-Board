import Button from '@/components/UI/Button';
import useGetBoardData from '@/hooks/useGetBoardData';
import useViewport from '@/hooks/useViewport';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import { selectActiveBoard } from '@/redux/slices/boardSlice';
import React, { useState } from 'react';
import TaskModal from '../Board/Task/TaskModal';
import Image from 'next/image';
import BoardMenu from '../Board/BoardMenu';
import UserMenu from '@/components/User/UserMenu';
import AddIcon from '@/public/assets/icon-add-task-mobile.svg';

const UserActions = () => {
    const activeBoard = useAppSelector(selectActiveBoard);
    const user = useAppSelector(selectUser);
    const [boardData, isFetchingBoardData] = useGetBoardData();
    const [isMobile] = useViewport();

    const [showAddNewTaskModal, setShowAddNewTaskModal] = useState(false);

    const stagesExist = boardData?.stages && boardData?.stages?.length > 0;

    function onAddNewTask() {
        setShowAddNewTaskModal(true);
    }

    function onCloseNewTask() {
        setShowAddNewTaskModal(false);
    }

    return (
        <>
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
                {!!activeBoard && <BoardMenu />}
                {!!user && <UserMenu />}
            </div>
            <TaskModal
                key={boardData?.id}
                showModal={showAddNewTaskModal}
                statusOptions={boardData?.stages!}
                onClose={onCloseNewTask}
            />
        </>
    );
};

export default UserActions;
