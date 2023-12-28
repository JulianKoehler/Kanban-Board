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
import { UserReturn } from '@/types/data/user';
import SanitizedHTML from 'react-sanitized-html';
import Avatar from '@/components/UI/Avatar';

type TaskProps = {
    currentBoard: BoardDataResponse;
    task: TaskResponse;
    index: number;
};

const Task = ({ currentBoard, task, index }: TaskProps) => {
    const [deleteTask, deleteResult] = restApi.tasks.useDeleteTaskMutation();
    const [updateStage, stageUpdateResult] = restApi.tasks.useUpdateStageMutation();
    const [updateAssingedUser, assignmentResult] = restApi.tasks.useUpdateAssingedUserMutation();
    const [subtasks, setSubtasks] = useState(task.subtasks);
    const activeBoard = useAppSelector(selectActiveBoard);
    const assignedUserName = `${task.assigned_user?.first_name} ${task?.assigned_user?.last_name}`;

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [showDeletionWarning, setShowDeletionWarning] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { showElement: showEditTaskMenu, setShowElement: setShowEditTaskMenu } = useMenuHandler(menuRef);

    const subtaskHeadline = getSubtaskHeadline(subtasks);
    const teamMembers = [currentBoard.owner, ...currentBoard.contributors];

    function handleEditCurrentBoard() {
        setShowEditTaskModal(true);
        setShowTaskModal(false);
        setShowEditTaskMenu(false);
    }

    function handleDeleteCurrentTask() {
        setShowDeletionWarning(true);
        setShowEditTaskMenu(false);
    }

    async function deleteCurrentTask() {
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

        if (!stageUpdateResult.isLoading && stageUpdateResult.isError) {
            toast.error('Could not update the task status.');
        }
    }

    async function handleChangeAssignedUser(userId: UserReturn['id']) {
        await updateAssingedUser({ taskId: task.id, assignedUserId: userId });

        if (!assignmentResult.isLoading && assignmentResult.isError) {
            toast.error('Could not assign the task, please try again.');
        }
    }

    useEffect(() => {
        if (deleteResult.isSuccess || stageUpdateResult.isSuccess) {
            setShowTaskModal(false);
        }
    }, [deleteResult.isSuccess, stageUpdateResult.isSuccess]);

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
                className="group max-w-[28rem] relative flex items-end cursor-pointer rounded-xl bg-white px-[1.6rem] py-[2.3rem] shadow-md hover:z-30 dark:bg-grey-dark dark:shadow-md-dark"
            >
                <div className='flex flex-col gap-[0.8rem]'>
                    <h3 className="text-lg font-bold group-hover:text-purple-main ">{task.title}</h3>
                    <p className="text-sm font-bold text-grey-medium">{subtaskHeadline}</p>
                </div>
                {task?.assigned_user && <Avatar className='w-[3rem] h-[3rem] text-sm absolute right-4 bottom-4' user={{
                    firstName: task?.assigned_user?.first_name,
                    lastName: task?.assigned_user?.last_name
                }} />}
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
                                onClick={handleDeleteCurrentTask}
                                className="rounded-b-xl px-[1.6rem] pb-[1.6rem] pt-[0.8rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Delete Task
                            </button>
                        </DropDownContainer>
                    </div>
                </div>
                <p className="text-base font-medium text-grey-medium">
                    <SanitizedHTML
                        allowedTags={['br', 'span']}
                        html={`
                        <span>
                            ${task.description.replace(/\n/g, '<br>') || 'No further details.'}
                        </span>`}
                    />
                </p>
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
                    <h4 className="text-sm font-bold text-grey-medium">Assinged To:</h4>
                    <DropDown
                        currentOption={task.assigned_user ? assignedUserName : ''}
                        dropDownOptions={teamMembers.map(user => ({
                            ...user,
                            title: `${user.first_name} ${user.last_name}`,
                        }))}
                        onOptionChange={handleChangeAssignedUser}
                    />
                </div>
                <div className="flex flex-col gap-[1.6rem]">
                    <h4 className="text-sm font-bold text-grey-medium">Current Status</h4>
                    <DropDown
                        currentOption={task?.status?.title}
                        dropDownOptions={currentBoard.stages}
                        onOptionChange={handleStatusChange}
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
                show={showDeletionWarning}
                type="task"
                title={task.title}
                onClose={() => setShowDeletionWarning(false)}
                deleteFunction={deleteCurrentTask}
                isLoading={deleteResult.isLoading}
            />
        </>
    );
};

export default Task;
