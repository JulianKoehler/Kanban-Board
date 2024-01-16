'use client';

import BoardListButton from '@/components/UI/Button/BoardListButton';
import BoardIcon from '@/components/UI/Icons/BoardIcon';
import { useGetBoardList } from '@/hooks/useGetBoardList';
import useViewport from '@/hooks/useViewport';
import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';
import { useAppDispatch, useAppSelector } from '@/services/redux/hooks';
import { selectActiveBoard, selectShowMobileMenu, setShowMobileMenu } from '@/services/redux/slices/boardSlice';
import { cn } from '@/util/combineStyles';

const BoardList = () => {
    const dispatch = useAppDispatch();
    const activeBoard = useAppSelector(selectActiveBoard);

    const { setCurrentBoardId } = useCurrentBoardIdContext();
    const showMobileMenu = useAppSelector(selectShowMobileMenu);
    const [boardList, allBoards] = useGetBoardList();

    const [isMobile, isTablet] = useViewport();

    if (boardList.isError) {
        throw boardList.error;
    }    

    return (
        <>
            {allBoards.map(board => {
                const active = activeBoard?.id === board.id;
                const maxNameLength = isTablet ? 18 : 20;

                function handleBoardSelection() {
                    isMobile && dispatch(setShowMobileMenu(!showMobileMenu));
                    setCurrentBoardId(board.id);
                }

                return (
                    <BoardListButton
                        key={board.id}
                        onClick={handleBoardSelection}
                        className={cn(
                            active && 'bg-purple-main fill-white text-white',
                            !active &&
                                'dark:hover:bg-white> fill-grey-medium text-grey-medium hover:bg-button-secondary-lightmode-idle hover:fill-purple-main hover:text-purple-main dark:hover:bg-white',
                        )}>
                        <BoardIcon />
                        {board.title.slice(0, maxNameLength)}
                        {board.title.length >= maxNameLength ? '...' : ''}
                    </BoardListButton>
                );
            })}
        </>
    );
};

export default BoardList;
