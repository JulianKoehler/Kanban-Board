import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import GenericModalContainer from '@/components/UI/Modal/GenericModalContainer';
import Input from '@/components/UI/InputFields/TextInput';
import Button from '@/components/UI/Button';
import DropDown from '@/components/UI/DropDown/DropDown';
import H5 from '@/components/UI/Headings/H5';
import Form from '@/components/UI/Formelements/Form';
import FormGroup from '@/components/UI/Formelements/FormGroup';
import checkFormValidity from '@/util/checkFormValidity';
import { LoadingSpinner_TailSpin as TailSpin } from '@/components/UI/LoadingSpinner';
import SubtaskInputArea from '../Subtask/SubtaskInputArea';
import { useAppSelector } from '@/redux/hooks';
import { selectActiveBoard } from '@/redux/slices/boardSlice';
import { restApi } from '@/redux/api';
import { Subtask } from '@/types/data/subtask';
import { Status } from '@/types/data/stages';
import { TaskCreate, TaskResponse, TaskUpdate } from '@/types/data/tasks';
import { skipToken } from '@reduxjs/toolkit/query';

type TaskModalProps = {
    statusOptions: Status[];
    task?: TaskResponse;
    onClose: VoidFunction;
    showModal: boolean;
    subtaskList?: Subtask[];
};

const TaskModal = ({ onClose, showModal, statusOptions, task }: TaskModalProps) => {
    const activeBoard = useAppSelector(selectActiveBoard);
    const [createTask, createResult] = restApi.tasks.useCreateTaskMutation();
    const [updateTask, updateResult] = restApi.tasks.useUpdateTaskMutation();
    const { data } = restApi.boards.useGetBoardDataByIdQuery(activeBoard ? activeBoard.id : skipToken )
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const isEditMode = !!task;
    const currentStageId = task?.status.id ?? statusOptions?.[0]?.id;
    const taskID = task?.id;
    const [title, setTitle] = useState(task?.title ?? '');
    const [description, setDescription] = useState(task?.description ?? '');
    const [subtasks, setSubtasks] = useState<Subtask[]>([]);
    const [status, setStatus] = useState<Status>({
        title: task?.status?.title ?? statusOptions?.[0]?.title ?? '',
        id: task?.status?.id ?? statusOptions?.[0]?.id ?? '',
    });

    function handleStatusChange(id: string, title: string) {
        setStatus({
            title,
            id,
        });
    }

    console.log(data);
    console.log(subtasks);
    

    function onChangeTitle(e: React.ChangeEvent<HTMLInputElement>) {
        if (
            title.length > 100 &&
            // @ts-ignore
            e.nativeEvent.inputType !== 'deleteContentBackward'
        ) {
            toast('Consider putting the details into the description', {
                icon: '🚫',
                id: taskID,
            });
            return;
        }
        setTitle(e.target.value);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsFormSubmitted(true);

        const toBeValidated = [title, status.title];
        subtasks.forEach(subtask => {
            if (!subtask.markedForDeletion) {
                toBeValidated.push(subtask.title);
            }
        });
        const isFormValid = checkFormValidity(toBeValidated);
        if (!isFormValid) return;

        const taskBase = {
            stageId: status.id,
            boardId: activeBoard!.id,
            title,
            description,
            subtasks,
        };

        isEditMode ? submitUpdateRequest(task.id, taskBase) : submitCreateRequest(taskBase);
    }

    async function submitCreateRequest(data: TaskCreate) {
        const newTask: TaskCreate = {
            ...data,
        };

        const response = createTask(newTask).unwrap();
        toast.promise(response, {
            loading: 'Creating your task...',
            success: 'Your task has been created.',
            error: () => `Your task could not be created: ${createResult.error}`,
        });

        await response;
    }

    async function submitUpdateRequest(id: string, data: TaskUpdate) {
        const updatedTask: TaskUpdate = {
            ...data,
            prevStageId: currentStageId,
        };
        
        const response = updateTask({ id, task: updatedTask }).unwrap();
        toast.promise(response, {
            loading: 'Updating your task...',
            success: 'Your task has been updated.',
            error: () => `Your task could not be updated: ${updateResult.error}`,
        });

        await response;
    }

    function initFormValues() {
        if (isEditMode) {
            setSubtasks(task.subtasks);
            setTitle(task.title);
            setDescription(task.description);
        } else {
            setSubtasks([]);
            setTitle('');
            setDescription('');
        }
        setIsFormSubmitted(false);
    }

    useEffect(() => {
        (createResult.isSuccess || updateResult.isSuccess) && onClose();
    }, [createResult.isSuccess, updateResult.isSuccess]);

    useEffect(() => {
        !showModal && initFormValues();
    }, [showModal]);

    return (
        <GenericModalContainer isShowing={showModal} additionalClassNames="w-[48rem] max-h-[71rem]">
            <Form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold">{task ? 'Edit Task' : 'Add New Task'}</h2>
                <FormGroup>
                    <H5>Title</H5>
                    <Input
                        className={isFormSubmitted && title.length < 1 ? 'input-error' : ''}
                        value={title}
                        onChange={onChangeTitle}
                        placeholder="e.g. Take coffee break"
                    />
                    {isFormSubmitted && title.length < 1 && (
                        <p className="absolute bottom-[0.9rem] right-[1.6rem] text-base font-medium text-red">
                            Can't be empty
                        </p>
                    )}
                </FormGroup>
                <FormGroup>
                    <H5>Description</H5>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="h-[11.2rem] w-full resize-none rounded-[0.4rem] border-[0.1rem] border-[#828fa340] bg-white px-[1.6rem] py-[0.9rem] text-base invalid:border-red focus:border-purple-main focus:outline-none dark:bg-grey-dark"
                        placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
                    />
                </FormGroup>
                <FormGroup>
                    <H5>Subtasks</H5>
                    <div className="max-w- flex flex-col gap-[1.2rem] overflow-y-auto overflow-x-hidden">
                        <SubtaskInputArea
                            subtasks={subtasks}
                            setSubtasks={setSubtasks}
                            isFormSubmitted={isFormSubmitted}
                        />
                    </div>
                </FormGroup>
                <FormGroup>
                    <H5>Status</H5>
                    <DropDown
                        onStatusChange={handleStatusChange}
                        dropDownOptions={statusOptions}
                        currentOption={task?.status?.title}
                    />
                </FormGroup>
                <div className="flex gap-4">
                    <Button type="submit" variant="primary" className="flex justify-center">
                        {!isEditMode && (createResult.isLoading ? TailSpin : 'Create Task')}
                        {isEditMode && (updateResult.isLoading ? TailSpin : 'Update Task')}
                    </Button>
                    <Button onClick={onClose} type="button" variant="secondary">
                        {isEditMode ? 'Discard Changes' : 'Cancel'}
                    </Button>
                </div>
            </Form>
        </GenericModalContainer>
    );
};

export default TaskModal;
