import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppSelector } from '@/redux/hooks';
import { selectActiveBoard } from '@/redux/slices/boardSlice';
import { motion } from 'framer-motion';
import { restApi } from '@/redux/api';

export type SubtaskProps = {
    checked: boolean;
    id: string;
    index: number;
    title: string;
    updateState: (index: number) => void;
};

const Subtask = ({ checked, id, index, title, updateState }: SubtaskProps) => {
    const [isCompleted, setIsCompleted] = useState(checked);
    const [toggleSubtask, result] = restApi.subtasks.useToggleSubtaskCompleteMutation();

    function handleCheck() {
        setIsCompleted(completed => !completed);
        updateState(index);
        toggleSubtask(id);
    }

    useEffect(() => {
        if (result.isError) toast.error('Could not update Subtask');
    }, [result.isError]);

    return (
        <div
            className={`flex cursor-pointer items-center rounded-md bg-grey-light focus:border-[0.1rem] focus:border-[purple-main] dark:bg-grey-dark ${
                !isCompleted && 'hover:bg-[#635fc740] dark:hover:bg-[#635fc740]'
            }`}
        >
            <motion.input
                id={id}
                className="absolute cursor-pointer opacity-0"
                checked={isCompleted}
                onChange={handleCheck}
                type="checkbox"
            />
            <label
                className={`flex w-[41.6rem] cursor-pointer items-center p-[1.2rem] text-sm font-bold transition-all duration-300 before:transition-all before:duration-300 ${
                    isCompleted
                        ? 'text-grey-medium line-through decoration-lines-light decoration-[0.1rem] before:bg-purple-main before:bg-checkIcon before:bg-center before:bg-no-repeat dark:decoration-lines-dark dark:before:bg-purple-main'
                        : ''
                } before:mr-[1.6rem] before:h-[1.6rem] before:min-w-[1.6rem] before:rounded before:border-[0.1rem] before:border-[#828fa333]  before:content-['']  ${
                    !isCompleted && 'before:bg-white before:dark:bg-grey-dark'
                }`}
                htmlFor={id}
            >
                {title}
            </label>
        </div>
    );
};

export default Subtask;
