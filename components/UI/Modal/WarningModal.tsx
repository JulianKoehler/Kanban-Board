import { LoadingSpinner_TailSpin as Tailspin } from '@/components/UI/LoadingSpinner';
import { ContextException } from '@/lib/exceptions';
import { cn } from '@/util/combineStyles';
import { PropsWithChildren, ReactNode, createContext, useContext, useState } from 'react';
import Button, { MainButtonProps } from '../Button/Button';
import GenericModalContainer from './GenericModalContainer';

type ModalType = 'destructive' | 'constructive';

type StyleVariances = {
    headlineTextColor: string;
    submitButtonVariant: MainButtonProps['variant'];
    cancelButtonVariant: MainButtonProps['variant'];
};

type StyleMap = Record<ModalType, StyleVariances>;

const styleMap: StyleMap = {
    destructive: {
        headlineTextColor: 'text-red',
        submitButtonVariant: 'destructive',
        cancelButtonVariant: 'secondary',
    },
    constructive: {
        headlineTextColor: 'text-purple-main',
        submitButtonVariant: 'primary',
        cancelButtonVariant: 'secondary',
    },
};

interface CommonProps {
    onClose: () => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

interface WarningModalContext extends CommonProps {
    _type: ModalType;
}

const WarningModalContext = createContext<WarningModalContext | null>(null);

interface WarningModalProps extends CommonProps {
    children: ReactNode;
    show: boolean;
    type: ModalType;
}

const WarningModal = ({ show, type, onClose, onSubmit, isLoading, children }: WarningModalProps) => {
    const [_type] = useState(type);

    return (
        <WarningModalContext.Provider value={{ _type, onClose, onSubmit, isLoading }}>
            <GenericModalContainer isShowing={show} className="w-[48rem] gap-[2.4rem]" onClose={onClose}>
                {children}
            </GenericModalContainer>
        </WarningModalContext.Provider>
    );
};

const Headline = ({ children }: PropsWithChildren) => {
    const { _type: modalType } = useWarningModalContext();
    return <h2 className={cn('text-xl font-bold', styleMap[modalType].headlineTextColor)}>{children}</h2>;
};

const Message = ({ children }: PropsWithChildren) => {
    return <p className="text-base font-medium text-grey-medium">{children}</p>;
};

const UserActionButtons = ({ submitLabel, cancelLabel }: { submitLabel: ReactNode; cancelLabel: ReactNode }) => {
    return (
        <div className="flex w-full flex-col gap-[1.6rem] tablet:flex-row">
            <SubmitButton>{submitLabel}</SubmitButton>
            <CancelButton>{cancelLabel}</CancelButton>
        </div>
    );
};

const SubmitButton = ({ children }: PropsWithChildren) => {
    const { onSubmit, _type, isLoading } = useWarningModalContext();

    return (
        <Button variant={styleMap[_type].submitButtonVariant} onClick={onSubmit} className="flex justify-center">
            {isLoading ? Tailspin : children}
        </Button>
    );
};

const CancelButton = ({ children }: PropsWithChildren) => {
    const { onClose, _type } = useWarningModalContext();

    return (
        <Button variant={styleMap[_type].cancelButtonVariant} onClick={onClose} className="flex justify-center">
            {children}
        </Button>
    );
};

WarningModal.Headline = Headline;
WarningModal.Message = Message;
WarningModal.UserActionButtons = UserActionButtons;
WarningModal.SubmitButton = SubmitButton;
WarningModal.CancelButton = CancelButton;

export default WarningModal;

const useWarningModalContext = () => {
    const context = useContext(WarningModalContext);
    const contextMessage = 'useWarningModalContext';
    const componentMessage = 'WarningModal';

    if (!context) {
        throw new ContextException(contextMessage, componentMessage);
    }

    return context;
};
