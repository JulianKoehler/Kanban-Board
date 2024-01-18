import { ButtonProps } from '@/components/UI/Button/Button';
import PromoteIcon from '@/components/UI/Icons/PromoteIcon';
import WarningModal from '@/components/UI/Modal/WarningModal';
import Tooltip from '@/components/UI/Tooltips/Tooltip';
import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';
import { useBoardModalContext } from '@/services/context/board-modal/board-modal-context';
import { ActionTypes } from '@/services/context/board-modal/types';
import { restApi } from '@/services/redux/api';
import { UserInfoReturn } from '@/types/data/user';
import { cn } from '@/util/combineStyles';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface PromoteUserProps extends ButtonProps {
    user: UserInfoReturn;
    show: boolean;
    tooltipMessage?: string;
}

const PromoteUser = ({ user, show, tooltipMessage, className, ...props }: PromoteUserProps) => {
    const [showPromoteWarning, setShowPromoteWarning] = useState(false);
    const [setBoardOwner, setBoardOwnerResult] = restApi.boards.useSetBoardOwnerMutation();
    const { dispatchBoard } = useBoardModalContext();
    const { currentBoardId } = useCurrentBoardIdContext();

    if (!show) {
        return null;
    }

    async function handlePromoteToOwner() {
        try {
            const response = setBoardOwner({ boardId: currentBoardId, userId: user.id }).unwrap();

            toast.promise(response, {
                loading: 'Sending...',
                success: `Board owner successfully updated!`,
                error: err => `Could not update owner: ${err?.data && err.data?.detail && err.data.detail}`,
            });

            if (setBoardOwnerResult.isError) return;

            await response;

            dispatchBoard({ type: ActionTypes.PROMOTE_TO_OWNER, payload: { user } });
        } catch (error) {
            console.error(error);
        }
        setShowPromoteWarning(false);
    }

    const PromoteButton = (
        <button
            type="button"
            {...props}
            onClick={() => setShowPromoteWarning(true)}
            className={cn(
                'w-[1.485rem aspect-square fill-grey-medium transition-colors duration-200 hover:fill-red',
                className,
            )}>
            <PromoteIcon />
        </button>
    );

    return (
        <>
            {!!tooltipMessage ? (
                <Tooltip className="mt-1" message={tooltipMessage}>
                    {PromoteButton}
                </Tooltip>
            ) : (
                PromoteButton
            )}
            <WarningModal
                show={showPromoteWarning}
                type="constructive"
                onClose={() => setShowPromoteWarning(false)}
                onSubmit={handlePromoteToOwner}>
                <WarningModal.Headline>Promote this board member?</WarningModal.Headline>
                <WarningModal.Message>
                    {`Are you sure you want to promote ${user?.first_name} ${user?.last_name} to the owner of this board? By confirming you will give all owner specific permissions to this user.`}
                </WarningModal.Message>
                <WarningModal.UserActionButtons submitLabel="Promote" cancelLabel="Cancel" />
            </WarningModal>
        </>
    );
};

export default PromoteUser;
