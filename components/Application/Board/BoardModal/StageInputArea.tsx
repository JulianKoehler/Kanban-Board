import Button from '@/components/UI/Button/Button';
import FormGroup from '@/components/UI/Formelements/FormGroup';
import H5 from '@/components/UI/Headings/H5';
import DeleteIcon from '@/components/UI/Icons/DeleteIcon';
import Input from '@/components/UI/InputFields/TextInput';
import Tooltip from '@/components/UI/Tooltips/Tooltip';
import { useBoardModalContext } from '@/services/context/board-modal/board-modal-context';
import { ActionTypes } from '@/services/context/board-modal/types';
import { AnimatePresence, motion } from 'framer-motion';

const StageInputArea = () => {
    const { boardData, dispatchBoard } = useBoardModalContext();
    const { stages, isFormSubmitted } = boardData;

    function handleStageInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        dispatchBoard({ type: ActionTypes.SET_STAGE_TITLE, payload: { title: e.target.value, index } });
    }

    function onColorInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        dispatchBoard({ type: ActionTypes.SET_STAGE_COLOR, payload: { color: e.target.value, index } });
    }

    function onDeleteStageInput(index: number) {
        dispatchBoard({ type: ActionTypes.REMOVE_STAGE, payload: { index } });
    }

    function onAddNewStageInput() {
        dispatchBoard({
            type: ActionTypes.ADD_STAGE,
            payload: {
                stage: {
                    id: '',
                    title: '',
                    color: '#49e57d',
                    index: stages.length,
                },
            },
        });
    }

    return (
        <FormGroup className="flex flex-col gap-[1.6rem]">
            <H5>Stages</H5>
            <div className="max-w- flex flex-col gap-[1.2rem]">
                <AnimatePresence>
                    {stages.map((stage, index) => {
                        return stage.markedForDeletion ? null : (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                key={stage.id}
                                className="relative flex items-center gap-[1.6rem]">
                                <Input
                                    value={stage.title}
                                    className={isFormSubmitted && stage.title.length < 1 ? 'input-error' : ''}
                                    onChange={e => handleStageInput(e, index)}
                                    placeholder="e.g. Backlog"
                                />
                                <Tooltip message="Delete">
                                    <button
                                        type="button"
                                        onClick={() => onDeleteStageInput(index)}
                                        className="aspect-square w-[1.485rem] fill-grey-medium transition-colors duration-200 hover:fill-red">
                                        <DeleteIcon />
                                    </button>
                                </Tooltip>
                                <Tooltip message="Change Color" className="h-11 w-12">
                                    <input
                                        onChange={e => onColorInput(e, index)}
                                        className="h-full w-full cursor-pointer"
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
        </FormGroup>
    );
};

export default StageInputArea;
