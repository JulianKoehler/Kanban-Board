import useViewport from '@/hooks/useViewport';
import { useAppSelector } from '@/services/redux/hooks';
import { selectActiveBoard, selectShowSidebar } from '@/services/redux/slices/boardSlice';
import { cn } from '@/util/combineStyles';

const BoardTitle = () => {
    const showSidebar = useAppSelector(selectShowSidebar);
    const activeBoard = useAppSelector(selectActiveBoard);
    const [isMobile, isTablet] = useViewport();
    const maxLengthBoardName = 30;

    return (
        <h1
            className={cn(
                isMobile ? 'text-xl' : isTablet ? 'text-[2rem]' : 'text-2xl',
                !showSidebar && !isTablet && !isMobile && 'ml-[3.2rem]',
                !showSidebar && isTablet && 'ml-[2.4rem]',
                'font-bold',
            )}>
            {activeBoard?.title.slice(0, maxLengthBoardName) || ''}
            {activeBoard?.title && activeBoard?.title.length > maxLengthBoardName ? '...' : ''}
        </h1>
    );
};

export default BoardTitle;
