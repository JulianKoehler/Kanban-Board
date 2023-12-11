import React, { useRef, useState } from 'react';
import GenericModalContainer from '../UI/Modal/GenericModalContainer';
import Form from '../UI/Formelements/Form';
import H5 from '../UI/Headings/H5';
import Input from '../UI/InputFields/TextInput';
import Button from '../UI/Button';
import { toast } from 'react-hot-toast';
import { LoadingSpinner_TailSpin } from '../UI/LoadingSpinner';
import { restApi } from '@/redux/api';
import { useAppSelector } from '@/redux/hooks';
import { selectActiveBoard } from '@/redux/slices/boardSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import { StageCreate } from '@/types/data/stages';

type Props = {
    onClose: () => void;
    showModal: boolean;
};

const AddColumn = ({ onClose, showModal }: Props) => {
    const activeBoard = useAppSelector(selectActiveBoard);
    const [createNewStage, result] = restApi.stages.useCreateStageMutation();
    const { data: boardData } = restApi.boards.useGetBoardDataByIdQuery(activeBoard ? activeBoard.id : skipToken);

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
        <GenericModalContainer isShowing={showModal} onClose={onClose} additionalClassNames="gap-12 w-[48rem]">
            <h2 className="text-xl font-bold">New Column</h2>
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

export default AddColumn;
