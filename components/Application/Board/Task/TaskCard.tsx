import Avatar from '@/components/UI/Avatar';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskModalType } from '@/services/context/task-modal/types';
import { useAppDispatch, useAppSelector } from '@/services/redux/hooks';
import { selectCurrentlyDraggingTask, setCurrentlyDraggingTask } from '@/services/redux/slices/boardSlice';
import { cn } from '@/util/combineStyles';
import getSubtaskHeadline from '@/util/getSubtaskHeadline';
import { HTMLMotionProps, motion } from 'framer-motion';
import { useState } from 'react';

const TaskCard = () => {
    const dispatch = useAppDispatch();
    const [isBeingDragged, setIsBeingDragged] = useState(false);
    const isDraggingSomeTask = !!useAppSelector(selectCurrentlyDraggingTask);
    const { taskData, setActiveModal } = useTaskModalContext();
    const { title, subtasks, assignedUser } = taskData;
    const subtaskHeadline = getSubtaskHeadline(subtasks);

    const motionProps: HTMLMotionProps<'div'> = {
        drag: true,
        whileDrag: {
            scale: 1.05,
        },
        dragSnapToOrigin: true,
        dragPropagation: true,
        initial: { opacity: 0.3 },
        animate: { opacity: 1 },
        transition: {
            type: 'spring',
            duration: 0.3,
        },
    };

    function handleOpenTask() {
        !isBeingDragged && setActiveModal(TaskModalType.PRESENTATION);
    }

    function handleDragStart() {
        dispatch(setCurrentlyDraggingTask(taskData));
        setIsBeingDragged(true);
    }

    function handleDragEnd() {
        dispatch(setCurrentlyDraggingTask(undefined));
        setIsBeingDragged(false);
    }

    return (
        <motion.div
            {...motionProps}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onMouseUp={handleOpenTask}
            className={cn(
                'group relative flex max-w-[28rem] cursor-pointer items-end rounded-xl bg-white px-[1.6rem] py-[2.3rem] shadow-md hover:z-30 dark:bg-grey-dark dark:shadow-md-dark',
                (isBeingDragged || isDraggingSomeTask) && 'pointer-events-none',
                isBeingDragged && 'z-10',
            )}>
            <div className="flex flex-col gap-[0.8rem]">
                <h3 className="text-lg font-bold group-hover:text-purple-main ">{title}</h3>
                <p className="text-sm font-bold text-grey-medium">{subtaskHeadline}</p>
            </div>
            {assignedUser && (
                <Avatar
                    className="absolute bottom-4 right-4 h-[3rem] w-[3rem] text-sm"
                    user={{
                        firstName: assignedUser?.first_name,
                        lastName: assignedUser?.last_name,
                    }}
                />
            )}
        </motion.div>
    );
};

export default TaskCard;
