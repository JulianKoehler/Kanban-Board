import { cn } from '@/util/combineStyles';
import { ButtonProps } from '../Button';

const MenuActionButton = ({ children, className, ...rest }: ButtonProps) => {
    return (
        <button
            {...rest}
            className={cn(
                'w-full px-[1.6rem] pb-[0.8rem] pt-[1.6rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800',
                className,
            )}>
            {children}
        </button>
    );
};

export default MenuActionButton;
