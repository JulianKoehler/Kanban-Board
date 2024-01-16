import Button from '@/components/UI/Button/Button';
import UserMenu from '@/components/User/UserMenu';
import useGetBoardData from '@/hooks/useGetBoardData';
import useViewport from '@/hooks/useViewport';
import AddIcon from '@/public/assets/icon-add-task-mobile.svg';
import { useAppSelector } from '@/services/redux/hooks';
import { selectUser } from '@/services/redux/slices/authSlice';
import { selectActiveBoard } from '@/services/redux/slices/boardSlice';
import Image from 'next/image';
import { useState } from 'react';
import BoardMenu from '../Board/BoardMenu';
import TaskModal from '../Board/Task/TaskModal';

const UserActions = () => {
    const activeBoard = useAppSelector(selectActiveBoard);
    const user = useAppSelector(selectUser);
    const { data: board, isFetching } = useGetBoardData();
    const [isMobile] = useViewport();

    const [showAddNewTaskModal, setShowAddNewTaskModal] = useState(false);

    const stagesExist = board?.stages && board?.stages?.length > 0;

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
                        disabled={!stagesExist || isFetching}>
                        {isMobile ? <Image src={AddIcon} alt="add" /> : '+Add New Task'}
                    </Button>
                )}
                {!!activeBoard && <BoardMenu />}
                {!!user && <UserMenu />}
            </div>
            <TaskModal
                key={board?.id}
                showModal={showAddNewTaskModal}
                statusOptions={board?.stages!}
                onClose={onCloseNewTask}
            />
        </>
    );
};

export default UserActions;
