import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';
import { restApi } from '@/services/redux/api';
import { useAppSelector } from '@/services/redux/hooks';
import { selectCurrentlyDraggingTask } from '@/services/redux/slices/boardSlice';
import { cn } from '@/util/combineStyles';
import { HTMLMotionProps, motion } from 'framer-motion';
import { MouseEvent, PropsWithChildren, useState } from 'react';
import toast from 'react-hot-toast';

type DragOverWrapperProps = PropsWithChildren<{ stageId: string } & HTMLMotionProps<'div'>>;

const DragOverWrapper = ({ children, stageId, className, ...props }: DragOverWrapperProps) => {
    const [updateStage, stageUpdateResult] = restApi.tasks.useUpdateStageMutation();
    const { currentBoardId: boardId } = useCurrentBoardIdContext();
    const [isDraggedOver, setIsDraggedOver] = useState(false);
    const draggedTask = useAppSelector(selectCurrentlyDraggingTask);

    function handleDragOver(e: MouseEvent) {
        e.preventDefault();
        const isHoldingMouse = e.buttons === 1;
        const isDraggingTask = !!draggedTask;
        const isCurrentStage = draggedTask?.status.id === stageId;

        isHoldingMouse && isDraggingTask && !isCurrentStage && setIsDraggedOver(true);
    }

    function handleDragOut() {
        setIsDraggedOver(false);
    }

    async function handleDrop() {
        setIsDraggedOver(false);
        isDraggedOver &&
            (await updateStage({
                taskId: draggedTask!.id,
                prevStageId: draggedTask!.status.id,
                newStageId: stageId,
                boardId,
            }));

        if (!stageUpdateResult.isLoading && stageUpdateResult.isError) {
            toast.error('Could not update the task status.');
            return;
        }
    }

    return (
        <motion.div
            onMouseOver={handleDragOver} // framer-motion currently does not support onDragOver
            onMouseLeave={handleDragOut}
            onMouseUp={handleDrop}
            className={cn(isDraggedOver && 'shadow-xl shadow-gray-300', className)}
            {...props}>
            {children}
        </motion.div>
    );
};

export default DragOverWrapper;
