import React from 'react';
import Button from '../Button';
import GenericModalContainer from './GenericModalContainer';
import { LoadingSpinner_TailSpin as Tailspin } from '@/components/UI/LoadingSpinner';

export type DeletionWarningProps = {
    title: string;
    message: string;
    isLoading?: boolean;
    callbackFn: () => void;
    onClose: () => void;
    show: boolean;
};

const ConstructiveWarning = ({
    title,
    message,
    isLoading,
    callbackFn,
    onClose,
    show,
}: DeletionWarningProps) => {

    return (
        <GenericModalContainer
            isShowing={show}
            additionalClassNames="w-[48rem] gap-[2.4rem]"
            onClose={onClose}
        >
            <h2 className="text-xl font-bold text-purple-main">{title}</h2>
            <p className="text-base font-medium text-grey-medium">{message}</p>
            <div className="flex w-full flex-col gap-[1.6rem] tablet:flex-row">
                <Button variant="primary" onClick={callbackFn} className="flex justify-center">
                    {isLoading ? Tailspin : 'Confirm'}
                </Button>
                <Button onClick={onClose} variant="secondary">
                    Cancel
                </Button>
            </div>
        </GenericModalContainer>
    );
};

export default ConstructiveWarning;
