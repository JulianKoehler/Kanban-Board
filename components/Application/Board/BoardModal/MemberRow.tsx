import Avatar from '@/components/UI/Avatar';
import Badge from '@/components/UI/Badge';
import DeleteIcon from '@/components/UI/Icons/DeleteIcon';
import ExitIcon from '@/components/UI/Icons/ExitIcon';
import PromoteIcon from '@/components/UI/Icons/PromoteIcon';
import WarningModal from '@/components/UI/Modal/WarningModal';
import Tooltip from '@/components/UI/Tooltips/Tooltip';
import { useBoardModalContext } from '@/services/context/board-modal/board-modal-context';
import { ActionTypes } from '@/services/context/board-modal/types';
import { restApi } from '@/services/redux/api';
import { useAppDispatch, useAppSelector } from '@/services/redux/hooks';
import { selectUser } from '@/services/redux/slices/authSlice';
import { setActiveBoard } from '@/services/redux/slices/boardSlice';
import { UserInfoReturn } from '@/types/data/user';
import { cn } from '@/util/combineStyles';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

type MemberRowProps = {
    member: UserInfoReturn;
    isEditMode: boolean;
    isAbleToManageTeam: boolean;
};

const MemberRow = ({ member, isEditMode, isAbleToManageTeam }: MemberRowProps) => {
    const dispatch = useAppDispatch();

    const { boardData, dispatchBoard } = useBoardModalContext();
    const { contributors, owner } = boardData;
    const currentUser = useAppSelector(selectUser);
    const boardId = useSearchParams().get('id') ?? '';

    const [setBoardOwner, setBoardOwnerResult] = restApi.boards.useSetBoardOwnerMutation();
    const [leaveBoard] = restApi.users.useLeaveBoardMutation();

    const [showDeletionWarning, setShowDeletionWarning] = useState(false);
    const [showPromoteWarning, setShowPromoteWarning] = useState(false);
    const [showLeaveBoardWarning, setShowLeaveBoardWarning] = useState(false);

    const isNewMember = contributors.find(user => user.id === member.id)?.isNew;
    const removable = isAbleToManageTeam && member.id !== owner.id;
    const promotable = removable && isEditMode && !isNewMember;
    const leavable = !isAbleToManageTeam && member.id === currentUser?.id;

    function handleRemoveUser() {
        dispatchBoard({ type: ActionTypes.REMOVE_CONTRIBUTOR, payload: { user: member } });
        setShowDeletionWarning(false);
    }

    async function handlePromoteToOwner() {
        try {
            const response = setBoardOwner({ boardId: boardId, userId: member.id }).unwrap();

            toast.promise(response, {
                loading: 'Sending...',
                success: `Board owner successfully updated!`,
                error: err => `Could not update owner: ${err?.data && err.data?.detail && err.data.detail}`,
            });

            if (setBoardOwnerResult.isError) return;

            await response;

            dispatchBoard({ type: ActionTypes.PROMOTE_TO_OWNER, payload: { user: member } });
        } catch (error) {
            console.error(error);
        }
        setShowPromoteWarning(false);
    }

    function handleLeaveBoard() {
        leaveBoard(boardId);
        dispatch(setActiveBoard(undefined));
    }

    return (
        <>
            <div className="flex items-center gap-3 p-1">
                <Avatar
                    className="text-md h-[3.5rem] w-[3.5rem]"
                    user={{ firstName: member.first_name, lastName: member.last_name }}
                />
                <span
                    className={cn(
                        'text-lg text-grey-dark dark:text-grey-light',
                        member?.id === currentUser?.id && 'font-bold',
                    )}>
                    {member.first_name + ' ' + member.last_name}
                </span>
                <Badge userType={member.id === owner.id ? 'owner' : 'member'} className="mr-auto" />
                {promotable && (
                    <Tooltip className="mt-1" message="Promote to Owner">
                        <button
                            type="button"
                            onClick={() => setShowPromoteWarning(true)}
                            className="w-[1.485rem aspect-square fill-grey-medium transition-colors duration-200 hover:fill-red">
                            <PromoteIcon />
                        </button>
                    </Tooltip>
                )}
                {removable && (
                    <Tooltip message="Remove">
                        <button
                            type="button"
                            onClick={() => setShowDeletionWarning(true)}
                            className="aspect-square w-[1.485rem] fill-grey-medium transition-colors duration-200 hover:fill-red">
                            <DeleteIcon />
                        </button>
                    </Tooltip>
                )}
                {leavable && (
                    <Tooltip className="mr-2 mt-auto" message="Leave board">
                        <button
                            type="button"
                            onClick={() => setShowLeaveBoardWarning(true)}
                            className="w-[1.485rem aspect-square fill-grey-medium transition-colors duration-200 hover:fill-red">
                            <ExitIcon />
                        </button>
                    </Tooltip>
                )}
            </div>
            <WarningModal
                show={showDeletionWarning}
                type="destructive"
                onClose={() => setShowDeletionWarning(false)}
                onSubmit={handleRemoveUser}>
                <WarningModal.Headline>Delete this Member?</WarningModal.Headline>
                <WarningModal.Message>
                    {`Are you sure you want to remove ${member} from your board?`}
                </WarningModal.Message>
                <WarningModal.UserActionButtons submitLabel="Delete" cancelLabel="Cancel" />
            </WarningModal>
            <WarningModal
                show={showPromoteWarning}
                type="constructive"
                onClose={() => setShowPromoteWarning(false)}
                onSubmit={handlePromoteToOwner}>
                <WarningModal.Headline>Promote this board member?</WarningModal.Headline>
                <WarningModal.Message>
                    {`Are you sure you want to promote ${member?.first_name} ${member?.last_name} to the owner of this board? By confirming you will give all owner specific permissions to this user.`}
                </WarningModal.Message>
                <WarningModal.UserActionButtons submitLabel="Delete" cancelLabel="Cancel" />
            </WarningModal>
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
                <WarningModal.UserActionButtons submitLabel="Delete" cancelLabel="Cancel" />
            </WarningModal>
        </>
    );
};

export default MemberRow;
