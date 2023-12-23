import { cn } from '@/util/combineStyles';
import { ReactNode } from 'react';

type TooltipProps = {
    message: string;
    className?: string;
    children: ReactNode;
    [key: string]: any;
};

const Tooltip = ({ message, children, className = '', ...props }: TooltipProps) => {
    return (
        <div data-tooltip={message} className={cn(className, 'tooltip')} {...props}>
            {children}
        </div>
    );
};

export default Tooltip;
