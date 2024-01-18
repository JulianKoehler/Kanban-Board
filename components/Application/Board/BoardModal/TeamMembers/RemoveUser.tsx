import { ButtonProps } from '@/components/UI/Button/Button';
import DeleteIcon from '@/components/UI/Icons/DeleteIcon';
import WarningModal from '@/components/UI/Modal/WarningModal';
import Tooltip from '@/components/UI/Tooltips/Tooltip';
import { useBoardModalContext } from '@/services/context/board-modal/board-modal-context';
import { ActionTypes } from '@/services/context/board-modal/types';
import { UserInfoReturn } from '@/types/data/user';
import { cn } from '@/util/combineStyles';
import { useState } from 'react';

interface RemoveUserProps extends ButtonProps {
    user: UserInfoReturn;
    show: boolean;
    tooltipMessage?: string;
}

const RemoveUser = ({ user, show, tooltipMessage, className, ...props }: RemoveUserProps) => {
    const [showDeletionWarning, setShowDeletionWarning] = useState(false);
    const { dispatchBoard } = useBoardModalContext();

    const RemoveButton = (
        <button
            type="button"
            onClick={() => setShowDeletionWarning(true)}
            className={cn(
                'w-[1.485rem aspect-square fill-grey-medium transition-colors duration-200 hover:fill-red',
                className,
            )}
            {...props}>
            <DeleteIcon />
        </button>
    );

    function handleRemoveUser() {
        dispatchBoard({ type: ActionTypes.REMOVE_CONTRIBUTOR, payload: { user } });
        setShowDeletionWarning(false);
    }

    if (!show) {
        return null;
    }

    return (
        <>
            {!!tooltipMessage ? (
                <Tooltip className="mt-1" message={tooltipMessage}>
                    {RemoveButton}
                </Tooltip>
            ) : (
                RemoveButton
            )}
            <WarningModal
                show={showDeletionWarning}
                type="destructive"
                onClose={() => setShowDeletionWarning(false)}
                onSubmit={handleRemoveUser}>
                <WarningModal.Headline>Delete this Member?</WarningModal.Headline>
                <WarningModal.Message>
                    {`Are you sure you want to remove ${user.first_name} ${user.last_name} from your board?`}
                </WarningModal.Message>
                <WarningModal.UserActionButtons submitLabel="Remove" cancelLabel="Cancel" />
            </WarningModal>
        </>
    );
};

export default RemoveUser;
