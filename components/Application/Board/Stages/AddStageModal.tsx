import Button from '@/components/UI/Button/Button';
import Form from '@/components/UI/Formelements/Form';
import H5 from '@/components/UI/Headings/H5';
import Input from '@/components/UI/InputFields/TextInput';
import { LoadingSpinner_TailSpin } from '@/components/UI/LoadingSpinner';
import GenericModalContainer from '@/components/UI/Modal/GenericModalContainer';
import useGetBoardData from '@/hooks/useGetBoardData';
import { restApi } from '@/services/redux/api';
import { useAppSelector } from '@/services/redux/hooks';
import { selectActiveBoard } from '@/services/redux/slices/boardSlice';
import { StageCreate } from '@/types/data/stages';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

type AddStageModalProps = {
    onClose: () => void;
    showModal: boolean;
};

const AddStageModal = ({ onClose, showModal }: AddStageModalProps) => {
    const activeBoard = useAppSelector(selectActiveBoard);
    const [createNewStage, result] = restApi.stages.useCreateStageMutation();
    const { data: boardData } = restApi.boards.useGetBoardDataByIdQuery(activeBoard ? activeBoard.id : skipToken);

    useGetBoardData()
    const [color, setColor] = useState('#67E2AE');
    const nameRef = useRef<HTMLInputElement>(null);
    const index = boardData?.stages?.length || 0;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const newStage: Required<StageCreate> = {
            id: '',
            boardId: activeBoard!.id,
            color,
            index,
            title: nameRef.current!.value,
        };

        const response = createNewStage(newStage);

        toast.promise(response, {
            loading: 'Sending...',
            success: 'Stage has been added!',
            error: err => `Could not add stage: ${result.error} ${err}`,
        });

        await response;
        onClose();
    }

    return (
        <GenericModalContainer isShowing={showModal} onClose={onClose} className="gap-12 w-[48rem]">
            <h2 className="text-xl font-bold">New Stage</h2>
            <Form onSubmit={handleSubmit}>
                <H5>Name</H5>
                <div className="flex flex-row items-center gap-6">
                    <Input ref={nameRef} />
                    <input className="h-10 w-10" type="color" value={color} onChange={e => setColor(e.target.value)} />
                </div>
                <Button className="flex justify-center">
                    {result.isLoading ? LoadingSpinner_TailSpin : 'Add Column'}
                </Button>
            </Form>
        </GenericModalContainer>
    );
};

export default AddStageModal;
