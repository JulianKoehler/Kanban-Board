import { cn } from '@/util/combineStyles';
import { ButtonProps } from '../Button';

export default function MenuToggleButton({ children, className, ...rest }: ButtonProps) {
    return (
        <button
            {...rest}
            className={cn(
                'duration 300 rounded-full p-[1rem] transition-all hover:bg-gray-200 dark:hover:bg-slate-800',
                className,
            )}>
            {children}
        </button>
    );
}
