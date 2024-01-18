import FormGroup from '@/components/UI/Formelements/FormGroup';
import H5 from '@/components/UI/Headings/H5';
import { useBoardModalContext } from '@/services/context/board-modal/board-modal-context';
import { useAppSelector } from '@/services/redux/hooks';
import { selectUser } from '@/services/redux/slices/authSlice';
import { useState } from 'react';
import MemberRow from './MemberRow';
import UserSearch from './UserSearch';

type TeamMembersProps = {
    isEditMode: boolean;
};

const TeamMembers = ({ isEditMode }: TeamMembersProps) => {
    const { boardData } = useBoardModalContext();
    const { contributors, owner } = boardData;
    const currentUser = useAppSelector(selectUser);

    const [isAddingMembers, setIsAddingMembers] = useState(false);

    const teamMembers = [owner, ...contributors.filter(member => !member?.markedForDeletion)];
    const isAbleToManageTeam = currentUser?.id === owner?.id;

    function handleShowSearchInput() {
        setIsAddingMembers(bool => !bool);
    }

    return (
        <>
            <FormGroup className="relative">
                <H5>Team members</H5>
                {teamMembers.map(member => (
                    <MemberRow
                        key={member.id}
                        member={member}
                        isEditMode={isEditMode}
                        isAbleToManageTeam={isAbleToManageTeam}
                    />
                ))}
                <UserSearch onClose={handleShowSearchInput} show={isAddingMembers} allowToggle={isAbleToManageTeam} />
            </FormGroup>
        </>
    );
};

export default TeamMembers;
