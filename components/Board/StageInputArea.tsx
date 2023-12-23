import React from 'react';
import Input from '../UI/InputFields/TextInput';
import DeleteIcon from '../UI/Icons/DeleteIcon';
import Button from '../UI/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { StageUpdate } from '@/types/data/stages';
import Tooltip from '../UI/Tooltips/Tooltip';

type Props = {
    stages: StageUpdate[];
    setStages: React.Dispatch<React.SetStateAction<StageUpdate[]>>;
    isFormSubmitted: boolean;
};

const StageInputArea = ({ stages, setStages, isFormSubmitted }: Props) => {
    console.log(stages);

    function handleColumnInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        setStages(prevStages => {
            const stages = [...prevStages];

            stages[index] = {
                ...stages[index],
                title: e.target.value,
            };

            return stages;
        });
    }

    function onColorInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        setStages(prevStages => {
            const stages = [...prevStages];

            stages[index] = {
                ...stages[index],
                color: e.target.value,
            };

            return stages;
        });
    }

    function onDeleteStageInput(index: number) {
        setStages(prevStages => {
            const stages = [...prevStages];
            const isNewStage = stages[index].id === '';

            stages[index] = {
                ...stages[index],
                markedForDeletion: true,
            };

            // Remove newly created stages directly in the frontend before submitting them to the API
            if (isNewStage) {
                stages.splice(index, 1);
            }

            return stages;
        });
    }

    function onAddNewStageInput() {
        setStages(prevStages => [
            ...prevStages,
            {
                id: '',
                title: '',
                color: '#49e57d',
                index: stages.length,
            },
        ]);
    }

    return (
        <>
            <div className="max-w- flex flex-col gap-[1.2rem]">
                <AnimatePresence>
                    {stages.map((stage, index) => {
                        return stage.markedForDeletion ? null : (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                key={stage.id}
                                className="relative flex items-center gap-[1.6rem]"
                            >
                                <Input
                                    value={stage.title}
                                    className={isFormSubmitted && stage.title.length < 1 ? 'input-error' : ''}
                                    onChange={e => handleColumnInput(e, index)}
                                    placeholder="e.g. Backlog"
                                />
                                <Tooltip message="Delete">
                                    <button
                                        type="button"
                                        onClick={() => onDeleteStageInput(index)}
                                        className="aspect-square w-[1.485rem] fill-grey-medium transition-colors duration-200 hover:fill-red"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </Tooltip>
                                <Tooltip message='Change Color' className='w-12 h-11'>
                                    <input
                                        onChange={e => onColorInput(e, index)}
                                        className='w-full h-full cursor-pointer'
                                        type="color"
                                        value={stage.color}
                                    />
                                </Tooltip>
                                {stage.title.length < 1 && isFormSubmitted && (
                                    <p className="absolute bottom-[0.9rem] right-[8.6rem] text-base font-medium text-red">
                                        Can't be empty
                                    </p>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
            <Button variant="secondary" type="button" onClick={onAddNewStageInput}>
                + Add New Stage
            </Button>
        </>
    );
};

export default StageInputArea;
