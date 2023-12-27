import React, { useEffect, useState } from 'react';
import Button from '../Button';
import GenericModalContainer from './GenericModalContainer';
import { LoadingSpinner_TailSpin as Tailspin } from '@/components/UI/LoadingSpinner';

export type DeletionWarningProps = {
    type: 'board' | 'task' | 'user' | 'board member';
    title: string;
    isLoading?: boolean;
    deleteFunction: VoidFunction;
    onClose: VoidFunction;
    show: boolean;
};

const DeletionWarning = ({
    type,
    title,
    isLoading,
    deleteFunction,
    onClose,
    show,
}: DeletionWarningProps) => {
    const [warningMessage, setWarningMessage] = useState(getWarningMessage())
    function getWarningMessage() {
        switch (type) {
            case 'board':
                return `Are you sure you want to delete the "${title}" board? This action will remove all columns and tasks and cannot be reversed.`;
            case 'task':
                return `Are you sure you want to delete the "${title}" task and its subtasks? This action cannot be reversed.`;
            case 'user':
                return 'Do you really want to delete your account? You will lose access to all of your boards, also the ones you created!';
            case 'board member':
                return `Are you sure you want to remove ${title} from your board?`
            }
    }

    useEffect(() => {
        console.log('hello');
        
        setWarningMessage(getWarningMessage())
    }, [show])

    return (
        <GenericModalContainer
            isShowing={show}
            additionalClassNames="w-[48rem] gap-[2.4rem]"
            onClose={onClose}
        >
            <h2 className="text-xl font-bold text-red">Delete this {type}?</h2>
            <p className="text-base font-medium text-grey-medium">{warningMessage}</p>
            <div className="flex w-full flex-col gap-[1.6rem] tablet:flex-row">
                <Button variant="destructive" onClick={deleteFunction} className="flex justify-center">
                    {isLoading ? Tailspin : 'Delete'}
                </Button>
                <Button onClick={onClose} variant="secondary">
                    Cancel
                </Button>
            </div>
        </GenericModalContainer>
    );
};

export default DeletionWarning;
