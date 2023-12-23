import { cn } from '@/util/combineStyles';
import React from 'react';

type MenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
};

export default function MenuButton({ children, className, ...rest }: MenuButtonProps) {
    return (
        <button
            {...rest}
            className={cn('duration 300 rounded-full p-[1rem] transition-all hover:bg-gray-200 dark:hover:bg-slate-800', className)}
        >
            {children}
        </button>
    );
}
