import { useEffect, useState } from 'react';
import BoardModal from './BoardModal';
import Stage from './Stage';
import Task from './Task';
import { useAppSelector } from '@/redux/hooks';
import { selectActiveBoard } from '@/redux/slices/boardSlice';
import ErrorFeedback from '@/components/UI/UserFeedback/ErrorFeedback';
import AddColumn from './AddStage';
import NoBoardData from './NoBoardData';
import LoadingSkeleton from '@/components/UI/LoadingSkeleton';
import { restApi } from '@/redux/api';

const Board = () => {
    const activeBoard = useAppSelector(selectActiveBoard);
    const [_, boardListResult] = restApi.boards.useLazyGetBoardListQuery();
    const [getBoardData, boardResult] = restApi.boards.useLazyGetBoardDataByIdQuery();

    const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
    const [showAddColumnModal, setShowAddColumnModal] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const hasError = boardResult.isError || boardListResult.isError;
    const [errorHeaderMessage, setErrorHeaderMessage] = useState<undefined | string>();
    const [errorDescriptionMessage, setErrorDescriptionMessage] = useState<undefined | string>();

    useEffect(() => {
        activeBoard && getBoardData(activeBoard.id);
    }, [activeBoard]);

    useEffect(() => {
        if (hasError) setShowErrorMessage(true);

        if (boardListResult.isError) {
            setErrorHeaderMessage('Failed to load Boardlist!');
            setErrorDescriptionMessage(
                'We are sorry, but currently we are not able to load your boards. Please try again later.',
            );
        }
        if (boardResult.isError) {
            setErrorHeaderMessage('Failed to load this Board!');
            setErrorDescriptionMessage(
                'We are sorry, but currently we are not able to load this board. Please try again later.',
            );
        }
    }, [hasError]);

    return (
        <>
            <main
                className={`relative flex h-[calc(100vh-6.4rem)] gap-[2.4rem] overflow-auto bg-grey-light px-[1.6rem] pt-[2.4rem] dark:bg-grey-very-dark tablet:h-[calc(100vh-9.6rem)] tablet:pb-40 tablet:pl-[2.4rem]`}
            >
                {boardResult.isLoading ? (
                    <LoadingSkeleton count={4} />
                ) : boardListResult.isError && showErrorMessage ? (
                    <ErrorFeedback
                        header={errorHeaderMessage}
                        description={errorDescriptionMessage}
                        onClose={() => setShowErrorMessage(false)}
                    />
                ) : (
                    <>
                        {boardResult.data?.stages?.map(stage => (
                            <Stage key={stage.id} stage={stage}>
                                {stage.tasks?.map((task, idx) => (
                                    <Task key={task.id} currentBoard={boardResult.data!} task={task} index={idx} />
                                ))}
                            </Stage>
                        ))}
                        {boardResult.data?.stages?.length! >= 1 && (
                            <div
                                onClick={() => setShowAddColumnModal(true)}
                                className="mt-[4rem] flex min-w-[28rem] cursor-pointer items-center justify-center rounded-[0.6rem] bg-gradient-to-b from-[#E9EFFA] to-[#e9effa80] text-2xl font-bold text-grey-medium hover:text-purple-main dark:from-[#2b2c3740] dark:to-[#2b2c3721]"
                            >
                                + New Column
                            </div>
                        )}
                        {(boardResult.status === 'uninitialized' || !boardResult.data?.stages?.length) && (
                            <NoBoardData
                                setShowAddColumnModal={setShowAddColumnModal}
                                setShowCreateBoardModal={setShowCreateBoardModal}
                            />
                        )}
                    </>
                )}
            </main>
            <BoardModal showModal={showCreateBoardModal} onClose={() => setShowCreateBoardModal(false)} />

            <AddColumn onClose={() => setShowAddColumnModal(false)} showModal={showAddColumnModal} />
        </>
    );
};

export default Board;
