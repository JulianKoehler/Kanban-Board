import Avatar from '@/components/UI/Avatar';
import Badge from '@/components/UI/Badge';
import { useBoardModalContext } from '@/services/context/board-modal/board-modal-context';
import { useAppSelector } from '@/services/redux/hooks';
import { selectUser } from '@/services/redux/slices/authSlice';
import { UserInfoReturn } from '@/types/data/user';
import { cn } from '@/util/combineStyles';
import LeaveBoard from './LeaveBoard';
import PromoteUser from './PromoteUser';
import RemoveUser from './RemoveUser';

type MemberRowProps = {
    member: UserInfoReturn;
    isEditMode: boolean;
    isAbleToManageTeam: boolean;
};

const MemberRow = ({ member, isEditMode, isAbleToManageTeam }: MemberRowProps) => {
    const { boardData } = useBoardModalContext();
    const { contributors, owner } = boardData;
    const currentUser = useAppSelector(selectUser);

    const isNewMember = contributors.find(user => user.id === member.id)?.isNew;
    const removable = isAbleToManageTeam && member.id !== owner.id;
    const promotable = removable && isEditMode && !isNewMember;
    const leavable = !isAbleToManageTeam && member.id === currentUser?.id;

    return (
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
            <PromoteUser user={member} show={promotable} tooltipMessage="Promote to Owner" />
            <RemoveUser user={member} show={removable} tooltipMessage="Remove" />
            <LeaveBoard show={leavable} tooltipMessage="Leave Board" />
        </div>
    );
};

export default MemberRow;
