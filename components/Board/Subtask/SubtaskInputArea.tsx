import Button from '@/components/UI/Button';
import DeleteIcon from '@/components/UI/Icons/DeleteIcon';
import Input from '@/components/UI/InputFields/TextInput';
import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Subtask } from '@/types/data/subtask';

type SubtaskInputAreaProps = {
    subtasks: Subtask[];
    setSubtasks: Dispatch<SetStateAction<Subtask[]>>;
    isFormSubmitted: boolean;
};

const SubtaskInputArea = ({ subtasks, setSubtasks, isFormSubmitted }: SubtaskInputAreaProps) => {
    function handleSubtaskInput(index: number) {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setSubtasks(prevSubtasks => {
                const subtasks = [...prevSubtasks!];

                subtasks[index] = {
                    ...subtasks[index],
                    title: e.target.value,
                };

                return subtasks;
            });
        };
    }

    function onDeleteSubtaskInput(index: number) {
        return () => {
            setSubtasks(prevSubtasks => {
                const subtasks = [...prevSubtasks!];

                subtasks[index] = {
                    ...subtasks[index],
                    markedForDeletion: true,
                };

                // Remove newly created subtasks directly in the frontend before submitting them to the API
                if (subtasks[index]?.isNew) {
                    subtasks.splice(index, 1)
                }

                return subtasks;
            });
        };
    }

    // Id will be set after submit by Postgresql
    function onAddNewSubtaskInput() {
        setSubtasks(prevSubtasks => [
            ...prevSubtasks,
            {
                index: subtasks.length,
                title: '',
                is_completed: false,
                id: '',
                isNew: true,
            },
        ]);
    }

    return (
        <>
            <AnimatePresence>
                {subtasks.map((subtask, index) => {
                    return subtask.markedForDeletion ? null : (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            key={subtask.id}
                            className="relative flex gap-[1.6rem]"
                        >
                            <Input
                                value={subtask.title}
                                className={isFormSubmitted && subtask.title.length < 1 ? 'input-error' : ''}
                                onChange={handleSubtaskInput(index)}
                                placeholder="e.g. Make coffee"
                            />
                            <motion.button
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                type="button"
                                onClick={onDeleteSubtaskInput(index)}
                                className="aspect-square w-[1.485rem] fill-grey-medium transition-colors duration-200 hover:fill-red"
                            >
                                <DeleteIcon />
                            </motion.button>
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
        </>
    );
};

export default SubtaskInputArea;
