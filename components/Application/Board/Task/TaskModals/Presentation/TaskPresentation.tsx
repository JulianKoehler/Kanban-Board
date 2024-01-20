import GenericModalContainer from '@/components/UI/Modal/GenericModalContainer';
import useGetBoardData from '@/hooks/useGetBoardData';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskModalType } from '@/services/context/task-modal/types';
import { UserInfoReturn } from '@/types/data/user';
import { cn } from '@/util/combineStyles';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import Subtasks from './Subtasks';
import TaskDescription from './TaskDescription';
import TaskMenu from './TaskMenu';
import TaskStatus from './TaskStatus';
import UserAssignment from './UserAssignment';

const TaskPresentation = () => {
    const { taskData, activeModal, setActiveModal } = useTaskModalContext();
    const { title } = taskData;
    const { data: currentBoard } = useGetBoardData();

    const teamMembers = [currentBoard?.owner, ...(currentBoard?.contributors ?? [])] as UserInfoReturn[];

    if (!currentBoard) {
        console.debug({ currentBoard });
        return null;
    }

    return (
        <>
            <GenericModalContainer
                isShowing={activeModal === TaskModalType.PRESENTATION}
                className="w-[48rem] gap-[2.4rem]"
                onClose={() => setActiveModal(null)}>
                <div className="relative flex items-center justify-between">
                    <h2 className="flex-1 text-xl font-bold">{title}</h2>
                    <TaskMenu />
                </div>
                <TaskDescription />
                <Subtasks />
                <UserAssignment users={teamMembers} />
                <TaskStatus stages={currentBoard.stages} />
            </GenericModalContainer>
        </>
    );
};

const Section = ({
    children,
    className,
    ...rest
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
    <div className={cn('flex flex-col gap-[1.6rem]', className)} {...rest}>
        {children}
    </div>
);

TaskPresentation.Section = Section;
export default TaskPresentation;
