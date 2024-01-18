import { ButtonProps } from '@/components/UI/Button/Button';
import ExitIcon from '@/components/UI/Icons/ExitIcon';
import WarningModal from '@/components/UI/Modal/WarningModal';
import Tooltip from '@/components/UI/Tooltips/Tooltip';
import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';
import { restApi } from '@/services/redux/api';
import { useAppDispatch } from '@/services/redux/hooks';
import { setActiveBoard } from '@/services/redux/slices/boardSlice';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface LeaveBoardProps extends ButtonProps {
    show: boolean;
    tooltipMessage?: string;
}

const LeaveBoard = ({ show, tooltipMessage, className, ...props }: LeaveBoardProps) => {
    const dispatch = useAppDispatch();
    const { push } = useRouter();
    const [showLeaveBoardWarning, setShowLeaveBoardWarning] = useState(false);
    const { currentBoardId, setCurrentBoardId } = useCurrentBoardIdContext();
    const [leaveBoard] = restApi.users.useLeaveBoardMutation();

    function handleLeaveBoard() {
        leaveBoard(currentBoardId);
        dispatch(setActiveBoard(undefined));
        setCurrentBoardId('');
        push('/board')
    }

    const LeaveButton = (
        <button
            type="button"
            onClick={() => setShowLeaveBoardWarning(true)}
            className="w-[1.485rem aspect-square fill-grey-medium transition-colors duration-200 hover:fill-red"
            {...props}>
            <ExitIcon />
        </button>
    );

    if (!show) {
        return null;
    }

    return (
        <>
            {!!tooltipMessage ? (
                <Tooltip className="mt-1" message={tooltipMessage}>
                    {LeaveButton}
                </Tooltip>
            ) : (
                LeaveButton
            )}
            <WarningModal
                show={showLeaveBoardWarning}
                type="constructive"
                onClose={() => setShowLeaveBoardWarning(false)}
                onSubmit={handleLeaveBoard}>
                <WarningModal.Headline>Leave this board?</WarningModal.Headline>
                <WarningModal.Message>
                    Are you sure you want to leave this board? By Confirming you will loose access until the owner adds
                    you again.
                </WarningModal.Message>
                <WarningModal.UserActionButtons submitLabel="Leave" cancelLabel="Cancel" />
            </WarningModal>
        </>
    );
};

export default LeaveBoard;
