'use client';

import useActivateBoard from '@/hooks/useActiveBoard';
import useGetBoardData from '@/hooks/useGetBoardData';
import { PropsWithChildren, useState } from 'react';
import BoardData from './BoardData';
import BoardModal from './BoardModal/BoardModal';
import LoadingSkeleton from './LoadingSkeleton';
import NoBoardData from './NoBoardData';
import AddStageButton from './Stages/AddStageButton';
import AddStageModal from './Stages/AddStageModal';

const Board = () => {
    useActivateBoard();
    const boardResult = useGetBoardData();
    const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
    const [showAddStageModal, setShowAddStageModal] = useState(false);

    const hasAtLeastOneStage = boardResult.data?.stages?.length! > 0;

    if (boardResult.isError) {
        throw boardResult.error;
    }

    if (boardResult.isFetching) {
        return (
            <BoardContainer>
                <LoadingSkeleton />
            </BoardContainer>
        );
    }

    return (
        <>
            <BoardContainer>
                <BoardData data={boardResult.data} />
                {hasAtLeastOneStage && <AddStageButton onClick={() => setShowAddStageModal(true)} />}
                {!hasAtLeastOneStage && (
                    <NoBoardData
                        setShowAddStageModal={setShowAddStageModal}
                        setShowCreateBoardModal={setShowCreateBoardModal}
                    />
                )}
            </BoardContainer>
            <AddStageModal showModal={showAddStageModal} onClose={() => setShowAddStageModal(false)} />
            <BoardModal showModal={showCreateBoardModal} onClose={() => setShowCreateBoardModal(false)} />
        </>
    );
};

const BoardContainer = ({ children }: PropsWithChildren) => {
    return (
        <main className="relative flex h-[calc(100vh-6.4rem)] gap-[2.4rem] overflow-auto bg-grey-light px-[1.6rem] pt-[2.4rem] dark:bg-grey-very-dark tablet:h-[calc(100vh-9.6rem)] tablet:pb-40 tablet:pl-[2.4rem]">
            {children}
        </main>
    );
};

export default Board;
