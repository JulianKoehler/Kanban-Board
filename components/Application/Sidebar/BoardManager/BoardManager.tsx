import { useState } from 'react';
import BoardModal from '@/components/Application/Board/BoardModal';
import BoardIcon from '@/components/UI/Icons/BoardIcon';
import Skeleton from 'react-loading-skeleton';
import { useGetBoardList } from '@/hooks/useGetBoardList';
import BoardList from './BoardList';

const BoardManager = () => {
    const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
    const [boardList] = useGetBoardList();
    const allBoards = [...(boardList.data?.own_boards ?? []), ...(boardList.data?.contributing ?? [])];
    const boardListLength = (allBoards && allBoards.length) ?? 0;

    function handleBoardCreation() {
        setShowCreateBoardModal(true);
    }

    return (
        <>
            <div>
                <h4 className="mb-8 text-sm font-bold uppercase tracking-wide text-grey-medium tablet:pl-[1.2rem] desktop:pl-3">
                    {boardList.isLoading ? 'loading boards...' : `my boards (${boardListLength})`}
                </h4>
                {boardList.isLoading && <Skeleton count={5} className="my-3 h-14" borderRadius={8} />}
                <BoardList boardList={allBoards} />
                {!boardList.isLoading && (
                    <button
                        onClick={handleBoardCreation}
                        className="flex items-center gap-[1.6rem] fill-purple-main py-[1.4rem] text-lg font-bold text-purple-main tablet:pl-[1.2rem] desktop:pl-3"
                    >
                        <BoardIcon /> + Create New Board
                    </button>
                )}
            </div>

            <BoardModal showModal={showCreateBoardModal} onClose={() => setShowCreateBoardModal(false)} />
        </>
    );
};

export default BoardManager;
