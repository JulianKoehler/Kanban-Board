import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Image from 'next/image';
import OptionsIcon from '@/public/assets/icon-vertical-ellipsis.svg';
import { useEffect, useRef, useState } from 'react';
import GenericModalContainer from '@/components/UI/Modal/GenericModalContainer';
import Subtask from '../Subtask';
import DropDownContainer from '../../UI/DropDown/DropDownContainer';
import DropDown from '../../UI/DropDown/DropDown';
import useMenuHandler from '@/hooks/useMenuHandler';
import TaskModal from './TaskModal';
import DeletionWarning from '@/components/UI/Modal/DeletionWarning';
import { useAppSelector } from '@/redux/hooks';
import { selectActiveBoard } from '@/redux/slices/boardSlice';
import getSubtaskHeadline from '@/util/getSubtaskHeadline';
import MenuButton from '@/components/UI/Button/MenuButton';
import { restApi } from '@/redux/api';
import { BoardDataResponse } from '@/types/data/board';
import { TaskResponse } from '@/types/data/tasks';
import { StageResponse } from '@/types/data/stages';

type TaskProps = {
    currentBoard: BoardDataResponse;
    task: TaskResponse;
    index: number;
};

const Task = ({ currentBoard, task, index }: TaskProps) => {
    const [deleteTask, deleteResult] = restApi.tasks.useDeleteTaskMutation();
    const [updateStage, { isSuccess: isSuccessUpdateStage, isError, isLoading }] =
        restApi.tasks.useUpdateStageMutation();
    const [subtasks, setSubtasks] = useState(task.subtasks);
    const activeBoard = useAppSelector(selectActiveBoard);

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [showDeletionWarning, setShowDeletionWarning] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { showElement: showEditTaskMenu, setShowElement: setShowEditTaskMenu } = useMenuHandler(menuRef);

    const taskDescription = task.description.replace(/\n/g, '<br>');
    const subtaskHeadline = getSubtaskHeadline(subtasks);

    function handleEditCurrentBoard() {
        setShowEditTaskModal(true);
        setShowTaskModal(false);
    }

    async function handleDeleteCurrentTask() {
        const response = deleteTask(task.id).unwrap();

        toast.promise(response, {
            loading: 'Sending...',
            success: `Your task has been deleted`,
            error: () => `Could not delete your task: ${deleteResult.error}`,
        });

        await response;
        setShowDeletionWarning(false);
    }

    function onSubtaskCheck(index: number) {
        setSubtasks(prevSubtasks => {
            const subtasks = [...prevSubtasks];
            subtasks[index] = { ...subtasks[index], is_completed: !subtasks[index].is_completed };

            return subtasks;
        });
    }

    async function handleStatusChange(stageId: StageResponse['id']) {
        await updateStage({
            taskId: task.id,
            prevStageId: task.status.id,
            newStageId: stageId,
            boardId: activeBoard?.id ?? '',
        });

        if (!isLoading && isError) {
            toast.error('Could not update the task status.');
        }
    }

    useEffect(() => {
        if (deleteResult.isSuccess || isSuccessUpdateStage) {
            setShowTaskModal(false);
        }
    }, [deleteResult.isSuccess, isSuccessUpdateStage]);

    useEffect(() => {
        setSubtasks(task.subtasks);
    }, [task.subtasks]);

    return (
        <>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: 'spring',
                    duration: 0.3,
                    delay: index * 0.1,
                }}
                onClick={() => setShowTaskModal(true)}
                className="group flex max-w-[28rem] cursor-pointer flex-col gap-[0.8rem] rounded-xl bg-white px-[1.6rem] py-[2.3rem] shadow-md hover:z-30 dark:bg-grey-dark dark:shadow-md-dark"
            >
                <h3 className="text-lg font-bold group-hover:text-purple-main ">{task.title}</h3>
                <p className="text-sm font-bold text-grey-medium">{subtaskHeadline}</p>
            </motion.div>
            <GenericModalContainer
                isShowing={!showDeletionWarning && showTaskModal}
                additionalClassNames="w-[48rem] gap-[2.4rem]"
                onClose={() => setShowTaskModal(false)}
            >
                <div className="relative flex items-center justify-between">
                    <h2 className="flex-1 text-xl font-bold">{task.title}</h2>
                    <div id="menu-dropdown" className="" ref={menuRef}>
                        <MenuButton onClick={() => setShowEditTaskMenu(prevState => !prevState)}>
                            <Image src={OptionsIcon} alt="options" />
                        </MenuButton>
                        <DropDownContainer show={showEditTaskMenu} additionalClassNames="right-0 top-[4.2rem]">
                            <button
                                onClick={handleEditCurrentBoard}
                                className="w-full rounded-t-xl px-[1.6rem] pb-[0.8rem] pt-[1.6rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Edit Task
                            </button>
                            <button
                                onClick={() => setShowDeletionWarning(true)}
                                className="rounded-b-xl px-[1.6rem] pb-[1.6rem] pt-[0.8rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Delete Task
                            </button>
                        </DropDownContainer>
                    </div>
                </div>
                <p
                    className="text-base font-medium text-grey-medium"
                    dangerouslySetInnerHTML={{
                        __html: taskDescription || 'No further details available',
                    }}
                ></p>
                <div className="flex flex-col gap-[0.8rem]">
                    <h4 className="mb-[0.8rem] text-sm font-bold text-grey-medium">{subtaskHeadline}</h4>
                    {subtasks.map((subtask, index) => (
                        <Subtask
                            key={subtask.id}
                            id={subtask.id}
                            index={index}
                            checked={subtask.is_completed}
                            title={subtask.title}
                            updateState={onSubtaskCheck}
                        />
                    ))}
                </div>
                <div className="flex flex-col gap-[1.6rem]">
                    <h4 className="text-sm font-bold text-grey-medium">Current Status</h4>
                    <DropDown
                        currentOption={task?.status?.title}
                        dropDownOptions={currentBoard.stages}
                        onStatusChange={handleStatusChange}
                    />
                </div>
            </GenericModalContainer>
            <TaskModal
                key={task.id}
                task={task}
                statusOptions={currentBoard.stages}
                subtaskList={subtasks}
                showModal={showEditTaskModal}
                onClose={() => setShowEditTaskModal(false)}
            />

            <DeletionWarning
                showDeletionWarning={showDeletionWarning}
                type="task"
                title={task.title}
                onClose={() => setShowDeletionWarning(false)}
                deleteFunction={handleDeleteCurrentTask}
                isLoading={deleteResult.isLoading}
            />
        </>
    );
};

export default Task;
