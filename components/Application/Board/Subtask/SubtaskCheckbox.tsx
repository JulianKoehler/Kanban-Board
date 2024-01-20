import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskActionTypes } from '@/services/context/task-modal/types';
import { restApi } from '@/services/redux/api';
import { cn } from '@/util/combineStyles';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export type SubtaskCheckboxProps = {
    index: number;
};

const SubtaskCheckbox = ({ index }: SubtaskCheckboxProps) => {
    const { taskData, dispatchTask } = useTaskModalContext();
    const { subtasks } = taskData;
    const subtask = subtasks[index];

    const [toggleSubtask, result] = restApi.subtasks.useToggleSubtaskCompleteMutation();
    const { currentBoardId: boardId } = useCurrentBoardIdContext();

    function handleCheck() {
        dispatchTask({ type: TaskActionTypes.TOGGLE_SUBTASK, payload: { index } });
        toggleSubtask({ id: subtask.id, boardId });
    }

    useEffect(() => {
        if (result.isError) toast.error('Could not update Subtask');
    }, [result.isError]);

    return (
        <div
            className={cn(
                'flex cursor-pointer items-center rounded-md bg-grey-light focus:border-[0.1rem] focus:border-[purple-main] dark:bg-grey-dark',
                !subtask.is_completed && 'hover:bg-[#635fc740] dark:hover:bg-[#635fc740]',
            )}>
            <motion.input
                id={subtask.id}
                className="absolute cursor-pointer opacity-0"
                checked={subtask.is_completed}
                onChange={handleCheck}
                type="checkbox"
            />
            <label
                className={`flex w-[41.6rem] cursor-pointer items-center p-[1.2rem] text-sm font-bold transition-all duration-300 before:transition-all before:duration-300 ${
                    subtask.is_completed
                        ? 'text-grey-medium line-through decoration-lines-light decoration-[0.1rem] before:bg-purple-main before:bg-checkIcon before:bg-center before:bg-no-repeat dark:decoration-lines-dark dark:before:bg-purple-main'
                        : ''
                } before:mr-[1.6rem] before:h-[1.6rem] before:min-w-[1.6rem] before:rounded before:border-[0.1rem] before:border-[#828fa333]  before:content-['']  ${
                    !subtask.is_completed && 'before:bg-white before:dark:bg-grey-dark'
                }`}
                htmlFor={subtask.id}>
                {subtask.title}
            </label>
        </div>
    );
};

export default SubtaskCheckbox;
