import { cn } from '@/util/combineStyles';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

type DropdownContainerProps = {
    children: React.ReactNode;
    show: boolean;
    className: string;
};

export type RefDiv = HTMLDivElement;

const DropdownContainer = React.forwardRef<RefDiv, DropdownContainerProps>(
    ({ children, show, className, ...props }, ref) => {
        return (
            <AnimatePresence>
                {show && (
                    <motion.div
                        {...props}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        ref={ref}
                        className={cn(
                            'absolute z-10 flex h-fit w-fit min-w-[19.2rem] flex-col rounded-xl bg-white p-0 shadow-sm dark:bg-grey-very-dark',
                            className,
                        )}>
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    },
);

DropdownContainer.displayName = 'DropdownContainer';

export default DropdownContainer;
