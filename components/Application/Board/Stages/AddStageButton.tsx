import { cn } from '@/util/combineStyles';
import { ButtonHTMLAttributes } from 'react';

type AddStageButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const AddStageButton = ({ className, ...props }: AddStageButtonProps) => {
    return (
        <button
            className={cn(
                'mt-[4rem] flex min-w-[28rem] cursor-pointer items-center justify-center rounded-[0.6rem] bg-gradient-to-b from-[#E9EFFA] to-[#e9effa80] text-2xl font-bold text-grey-medium hover:text-purple-main dark:from-[#2b2c3740] dark:to-[#2b2c3721]',
                className,
            )}
            {...props}>
            + New Stage
        </button>
    );
};

export default AddStageButton;
