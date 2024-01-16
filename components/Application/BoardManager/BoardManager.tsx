import BoardModal from '@/components/Application/Board/BoardModal/BoardModal';
import BoardListFallback from '@/components/UI/Fallbacks/Error/BoardListFallback';
import BoardIcon from '@/components/UI/Icons/BoardIcon';
import { useGetBoardList } from '@/hooks/useGetBoardList';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import BoardList from './BoardList';

const BoardManager = () => {
    const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
    const [{ isLoading }, allBoards] = useGetBoardList();
    const boardListLength = (allBoards && allBoards.length) ?? 0;

    function handleBoardCreation() {
        setShowCreateBoardModal(true);
    }

    return (
        <>
            <div>
                <h4 className="mb-8 text-sm font-bold uppercase tracking-wide text-grey-medium tablet:pl-[1.2rem] desktop:pl-3">
                    {isLoading ? 'loading boards...' : `my boards (${boardListLength})`}
                </h4>
                {isLoading && <Skeleton count={5} className="my-3 h-14" borderRadius={8} />}
                <ErrorBoundary FallbackComponent={BoardListFallback}>
                    <BoardList />
                </ErrorBoundary>
                {!isLoading && (
                    <button
                        onClick={handleBoardCreation}
                        className="flex items-center gap-[1.6rem] fill-purple-main py-[1.4rem] text-lg font-bold text-purple-main tablet:pl-[1.2rem] desktop:pl-3">
                        <BoardIcon /> + Create New Board
                    </button>
                )}
            </div>

            <BoardModal showModal={showCreateBoardModal} onClose={() => setShowCreateBoardModal(false)} />
        </>
    );
};

export default BoardManager;
