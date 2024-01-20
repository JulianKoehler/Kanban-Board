import UserMenu from '@/components/Application/User/UserMenu';
import Button from '@/components/UI/Button/Button';
import useGetBoardData from '@/hooks/useGetBoardData';
import useViewport from '@/hooks/useViewport';
import AddIcon from '@/public/assets/icon-add-task-mobile.svg';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskModalType } from '@/services/context/task-modal/types';
import { useAppSelector } from '@/services/redux/hooks';
import { selectUser } from '@/services/redux/slices/authSlice';
import { selectActiveBoard } from '@/services/redux/slices/boardSlice';
import Image from 'next/image';
import BoardMenu from '../Board/BoardMenu';
import TaskCreating from '../Board/Task/TaskModals/TaskCreating/TastCreating';

const UserActions = () => {
    const activeBoard = useAppSelector(selectActiveBoard);
    const user = useAppSelector(selectUser);
    const { data: board, isFetching } = useGetBoardData();
    const [isMobile] = useViewport();
    const { setActiveModal } = useTaskModalContext();

    const stagesExist = board?.stages && board?.stages?.length > 0;

    function onAddNewTask() {
        setActiveModal(TaskModalType.CREATING);
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
            <TaskCreating />
        </>
    );
};

export default UserActions;
