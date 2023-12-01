import BoardIcon from '@/components/UI/Icons/BoardIcon';
import useViewport from '@/hooks/useViewport';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectActiveBoard, setActiveBoard } from '@/redux/slices/boardSlice';
import localStorageIdentifiers from '@/util/localStorageIdentifiers';
import { BoardListProps } from '@/types/component-props/boardList.model';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import { cn } from '@/util/combineStyles';

const BoardList = ({ boardList, onMobileClose }: BoardListProps) => {
    const dispatch = useAppDispatch();
    const activeBoard = useAppSelector(selectActiveBoard);
    const [isMobile, isTablet] = useViewport();

    return (
        <>
            {boardList?.map((board, index) => {
                const active = activeBoard?.id === board.id;
                const maxNameLength = isTablet ? 18 : 20;

                function handleBoardSelection() {
                    const newBoard = boardList![index];
                    dispatch(setActiveBoard(newBoard));
                    isMobile ? onMobileClose() : null;
                }

                return (
                    <motion.button
                        initial={{ translateX: -50, opacity: 0 }}
                        animate={{ translateX: 0, opacity: 1 }}
                        transition={{
                            transition: 0.4,
                            damping: 1,
                        }}
                        key={board.id}
                        onClick={handleBoardSelection}
                        className={cn(
                            'relative left-[-2.4rem] flex w-[24rem] gap-[1.6rem] overflow-y-auto overflow-x-hidden whitespace-nowrap rounded-r-[2.4rem] py-[1.4rem] pl-[2.4rem] text-lg font-bold transition-colors duration-300 tablet:left-[-1.2rem] tablet:min-w-[24rem] desktop:left-[-2.4rem] desktop:w-[27.6rem] desktop:pl-[3.2rem]',
                            active && 'bg-purple-main fill-white text-white',
                            !active &&
                                'dark:hover:bg-white> fill-grey-medium text-grey-medium hover:bg-button-secondary-lightmode-idle hover:fill-purple-main hover:text-purple-main dark:hover:bg-white',
                        )}
                    >
                        <BoardIcon />
                        {board.title.slice(0, maxNameLength)}
                        {board.title.length >= maxNameLength ? '...' : ''}
                    </motion.button>
                );
            })}
        </>
    );
};

export default BoardList;
