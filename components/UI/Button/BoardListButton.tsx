import { cn } from '@/util/combineStyles';
import { HTMLMotionProps, motion } from 'framer-motion';

const BoardListButton = ({ children, className, ...props }: HTMLMotionProps<'button'>) => {
    return (
        <motion.button
            initial={{ translateX: -50, opacity: 0 }}
            animate={{ translateX: 0, opacity: 1 }}
            transition={{
                transition: 0.4,
                damping: 1,
            }}
            className={cn(
                'relative left-[-2.4rem] flex w-[24rem] gap-[1.6rem] overflow-y-auto overflow-x-hidden whitespace-nowrap rounded-r-[2.4rem] py-[1.4rem] pl-[2.4rem] text-lg font-bold transition-colors duration-300 tablet:left-[-1.2rem] tablet:min-w-[24rem] desktop:left-[-2.4rem] desktop:w-[27.6rem] desktop:pl-[3.2rem]',
                className,
            )}
            {...props}>
            {children}
        </motion.button>
    );
};

export default BoardListButton;
