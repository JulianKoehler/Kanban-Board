import Button from '@/components/UI/Button/Button';
import { useGetBoardList } from '@/hooks/useGetBoardList';
import WelcomeImage from '@/public/assets/empty.png';
import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Dispatch, MouseEventHandler, SetStateAction } from 'react';

type NoBoardDataProps = {
    setShowAddStageModal: Dispatch<SetStateAction<boolean>>;
    setShowCreateBoardModal: Dispatch<SetStateAction<boolean>>;
};

const NoBoardData = ({ setShowAddStageModal, setShowCreateBoardModal }: NoBoardDataProps) => {
    const [{ isUninitialized }, allBoards] = useGetBoardList();
    const { currentBoardId } = useCurrentBoardIdContext();
    const isBoardSelected = !!currentBoardId;    

    const userHasBoards = allBoards.length > 0;

    const callToActionMessage = isBoardSelected
        ? 'This board is empty. Create a new stage to get started.'
        : userHasBoards
        ? 'Welcome! Select one of your boards in the sidebar to get started'
        : "You don't have any boards. Create one to get started.";

    return (
        <>
            <motion.div
                initial={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                className="m-auto flex flex-col items-center justify-between gap-[4.7rem]">
                <p className="text-center text-xl font-bold text-grey-medium">{callToActionMessage}</p>
                {userHasBoards && !isBoardSelected && (
                    <Image width={500} src={WelcomeImage} alt="person-with-smartphone" />
                )}
                {isBoardSelected && <AddStageButton onClick={() => setShowAddStageModal(true)} />}
                {!isUninitialized && !userHasBoards && (
                    <CreateBoardButton onClick={() => setShowCreateBoardModal(true)} />
                )}
            </motion.div>
        </>
    );
};

const AddStageButton = ({ onClick }: { onClick: MouseEventHandler }) => (
    <Button onClick={onClick} variant="primary" large>
        + Add New Stage
    </Button>
);

const CreateBoardButton = ({ onClick }: { onClick: MouseEventHandler }) => (
    <Button onClick={onClick} variant="primary" large>
        + Create New Board
    </Button>
);

export default NoBoardData;
