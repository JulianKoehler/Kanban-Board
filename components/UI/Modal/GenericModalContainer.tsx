import { cn } from '@/util/combineStyles';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

type ContainerProps = {
    children: React.ReactNode;
    className?: string;
};

type ModalProps = ContainerProps & {
    onClose?: () => void;
    backdropModifications?: string | '';
    isShowing: boolean;
};

type BackdropProps = {
    children: React.ReactNode;
    mods?: string | '';
    onClick?: () => void;
};

const Backdrop = ({ children, mods, onClick }: BackdropProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.2,
            }}
            onClick={onClick}
            className={cn(
                'absolute left-0 top-0 z-40 flex h-full w-full items-center justify-center overflow-hidden bg-modal-backdrop',
                mods,
            )}>
            {children}
        </motion.div>
    );
};

const ModalOverlay = ({ children, className = '' }: ContainerProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: -0 }}
            exit={{ opacity: 0, y: -50 }}
            onClick={e => e.stopPropagation()}
            className={cn(
                'z-50 flex max-h-[90%] max-w-[90%] flex-col !overflow-y-auto overflow-x-visible rounded-xl bg-white p-[2.4rem] shadow-sm dark:bg-grey-very-dark tablet:p-[3.2rem]',
                className,
            )}>
            {children}
        </motion.div>
    );
};

const GenericModalContainer = ({ onClose, children, isShowing, className, backdropModifications }: ModalProps) => {
    const backdrop = useRef<Element | null>(null);
    const modalOverlay = useRef<Element | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        backdrop.current = document.querySelector<HTMLElement>('#backdrop');
        modalOverlay.current = document.querySelector<HTMLElement>('#overlay');
        setMounted(true);
    }, []);

    return mounted && backdrop.current && modalOverlay.current ? (
        <>
            {ReactDOM.createPortal(
                <AnimatePresence mode="wait">
                    {isShowing && (
                        <Backdrop mods={backdropModifications} onClick={onClose}>
                            <ModalOverlay className={className}>{children}</ModalOverlay>
                        </Backdrop>
                    )}
                    ,
                </AnimatePresence>,
                backdrop.current,
            )}
        </>
    ) : null;
};

export default GenericModalContainer;
