import Button from '@/components/UI/Button/Button';
import FormGroup from '@/components/UI/Formelements/FormGroup';
import H5 from '@/components/UI/Headings/H5';
import DeleteIcon from '@/components/UI/Icons/DeleteIcon';
import Input from '@/components/UI/InputFields/TextInput';
import Tooltip from '@/components/UI/Tooltips/Tooltip';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskActionTypes } from '@/services/context/task-modal/types';
import { AnimatePresence, motion } from 'framer-motion';

const SubtaskInputArea = () => {
    const { dispatchTask, taskData } = useTaskModalContext();
    const { subtasks, isFormSubmitted } = taskData;

    function handleSubtaskInput(index: number) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            dispatchTask({ type: TaskActionTypes.SET_SUBTASK_TITLE, payload: { title: e.target.value, index } });
        };
    }

    function onDeleteSubtaskInput(index: number) {
        return () => {
            dispatchTask({ type: TaskActionTypes.DELETE_SUBTASK, payload: { index } });
        };
    }

    function onAddNewSubtaskInput() {
        dispatchTask({ type: TaskActionTypes.ADD_SUBTASK });
    }

    return (
        <FormGroup>
            <H5>Subtasks</H5>
            <div className="max-w- flex flex-col gap-[1.2rem]">
                <AnimatePresence>
                    {subtasks.map((subtask, index) => {
                        return subtask.markedForDeletion ? null : (
                            <motion.div
                                initial={{ scale: 0.7, opacity: 0.4 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                key={subtask.id}
                                className="relative flex items-center gap-[1.6rem]">
                                <Input
                                    value={subtask.title}
                                    className={isFormSubmitted && subtask.title.length < 1 ? 'input-error' : ''}
                                    onChange={handleSubtaskInput(index)}
                                    placeholder="e.g. Make coffee"
                                />
                                <Tooltip message="Delete">
                                    <motion.button
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        type="button"
                                        onClick={onDeleteSubtaskInput(index)}
                                        className="aspect-square w-[1.485rem] fill-grey-medium transition-colors duration-200 hover:fill-red">
                                        <DeleteIcon />
                                    </motion.button>
                                </Tooltip>
                                {subtask.title.length < 1 && isFormSubmitted && (
                                    <p className="absolute bottom-[0.9rem] right-[4.6rem] text-base font-medium text-red">
                                        Can't be empty
                                    </p>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <Button variant="secondary" type="button" onClick={onAddNewSubtaskInput}>
                    + Add New Subtask
                </Button>
            </div>
        </FormGroup>
    );
};

export default SubtaskInputArea;
