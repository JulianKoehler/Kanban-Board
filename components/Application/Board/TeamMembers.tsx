import React, { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from 'react';
import FormGroup from '@/components/UI/Formelements/FormGroup';
import H5 from '@/components/UI/Headings/H5';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import { restApi } from '@/redux/api';
import debounce from '@/util/debounce';
import { ContributorUpdate, UserInfoReturn } from '@/types/data/user';
import Avatar from '@/components/UI/Avatar';
import { cn } from '@/util/combineStyles';
import Badge from '@/components/UI/Badge';
import Tooltip from '@/components/UI/Tooltips/Tooltip';
import DeleteIcon from '@/components/UI/Icons/DeleteIcon';
import { AnimatePresence, motion } from 'framer-motion';
import DropDownContainer from '@/components/UI/DropDown/DropDownContainer';
import Input from '@/components/UI/InputFields/TextInput';
import Button from '@/components/UI/Button';
import DeletionWarning from '@/components/UI/Modal/DeletionWarning';
import PromoteIcon from '@/components/UI/Icons/PromoteIcon';
import ExitIcon from '@/components/UI/Icons/ExitIcon';
import ConstructiveWarning from '@/components/UI/Modal/ConstructiveWarning';
import { selectActiveBoard, setActiveBoard } from '@/redux/slices/boardSlice';

type TeamMembersProps = {
    owner: UserInfoReturn;
    contributors: ContributorUpdate[];
    isEditMode: boolean;
    onAddContributor: (user: ContributorUpdate) => void;
    onRemoveContributor: (user: ContributorUpdate) => void;
    onPromoteToOwner: (user: UserInfoReturn) => void;
};

const TeamMembers = ({
    owner,
    contributors,
    isEditMode,
    onAddContributor,
    onRemoveContributor,
    onPromoteToOwner,
}: TeamMembersProps) => {
    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(selectUser);
    const activeBoard = useAppSelector(selectActiveBoard);
    const [selectedMember, setSelectedMember] = useState<ContributorUpdate | null>(null);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [searchUsers, userSearchResult] = restApi.users.useLazySearchAllUsersQuery();
    const [leaveBoard, leaveBoardResult] = restApi.users.useLeaveBoardMutation();
    const [isAddingMembers, setIsAddingMembers] = useState(false);
    const [showDeletionWarning, setShowDeletionWarning] = useState(false);
    const [showPromoteWarning, setShowPromoteWarning] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showLeaveBoardWarning, setShowLeaveBoardWarning] = useState(false);

    const filteredUserSearchResult = useMemo(
        () =>
            userSearchResult.data?.filter(
                user => !contributors.some(contributor => contributor.id === user.id && !contributor.markedForDeletion),
            ),
        [userSearchResult.data],
    );
    const teamMembers = [owner, ...contributors.filter(member => !member?.markedForDeletion)];
    const isAbleToManageTeam = currentUser?.id === owner?.id;
    const promoteWarningMessage = `Are you sure you want to promote ${selectedMember?.first_name} ${selectedMember?.last_name} to the owner of this board? By confirming you will give all owner specific permissions to this user.`;
    const leaveBoardMessage = 'Are you sure you want to leave this board? By Confirming you will loose access until the owner adds you again.'

    async function handleUserSearch(value: string) {
        searchUsers(value);
        setShowSearchResults(true);
    }

    const DEBOUNCE_INTERVAL = 300;
    const debouncedUserSearch = debounce(handleUserSearch, DEBOUNCE_INTERVAL);

    function onChangeUserSearch(e: ChangeEvent<HTMLInputElement>) {
        setUserSearchTerm(e.target.value);
        debouncedUserSearch(e.target.value);
    }

    function handleAddUserToBoard(user: ContributorUpdate) {
        return () => {
            const recentlyDeleted = contributors.some(
                contributor => contributor.id === user.id && contributor?.markedForDeletion,
            );
            if (recentlyDeleted) {
                onAddContributor({ ...user, isNew: false, markedForDeletion: false });
            } else {
                onAddContributor({ ...user, isNew: true });
            }
            setShowSearchResults(false);
            setUserSearchTerm('');
        };
    }

    function handleRemoveUser() {
        if (!selectedMember) return;

        onRemoveContributor({ ...selectedMember, markedForDeletion: true });
        setShowDeletionWarning(false);
    }

    function handlePromoteToOwner() {
        if (!selectedMember) return;

        onPromoteToOwner(selectedMember);
        setShowPromoteWarning(false);
    }

    function handleLeaveBoard() {
        leaveBoard(activeBoard!.id)
        dispatch(setActiveBoard(undefined))
    }

    function handleShowSearchInput() {
        setShowSearchResults(false);
        setUserSearchTerm('');
        setIsAddingMembers(bool => !bool);
    }

    function handleMemberAction(memberAction: Dispatch<SetStateAction<boolean>>) {
        return (value: boolean) => (member: UserInfoReturn) => {
            setSelectedMember(member);
            memberAction(value);
        };
    }

    return (
        <>
            <FormGroup additionalClasses="relative">
                <H5>Team members</H5>
                {teamMembers.map(member => {
                    const isNewMember = contributors.find(user => user.id === member.id)?.isNew;
                    const removable = isAbleToManageTeam && member.id !== owner.id;
                    const promotable = removable && isEditMode && !isNewMember
                    const leavable = !isAbleToManageTeam && member.id === currentUser?.id;

                    return (
                        <div key={member.id} className="flex items-center gap-3 p-1">
                            <Avatar
                                className="text-md h-[3.5rem] w-[3.5rem]"
                                user={{ firstName: member.first_name, lastName: member.last_name }}
                            />
                            <span
                                className={cn(
                                    'text-lg text-grey-dark dark:text-grey-light',
                                    member?.id === currentUser?.id && 'font-bold',
                                )}
                            >
                                {member.first_name + ' ' + member.last_name}
                            </span>
                            <Badge userType={member.id === owner.id ? 'owner' : 'member'} className='mr-auto'/>
                            {promotable && (
                                <Tooltip className="mt-1" message="Promote to Owner">
                                    <button
                                        type="button"
                                        onClick={() => handleMemberAction(setShowPromoteWarning)(true)(member)}
                                        className="w-[1.485rem aspect-square fill-grey-medium transition-colors duration-200 hover:fill-red"
                                    >
                                        <PromoteIcon />
                                    </button>
                                </Tooltip>
                            )}
                            {removable && (
                                <Tooltip message="Remove">
                                    <button
                                        type="button"
                                        onClick={() => handleMemberAction(setShowDeletionWarning)(true)(member)}
                                        className="aspect-square w-[1.485rem] fill-grey-medium transition-colors duration-200 hover:fill-red"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </Tooltip>
                            )}
                            {leavable && (
                                <Tooltip className="mr-2 mt-auto" message="Leave board">
                                    <button
                                        type="button"
                                        onClick={() => setShowLeaveBoardWarning(true)}
                                        className="w-[1.485rem aspect-square fill-grey-medium transition-colors duration-200 hover:fill-red"
                                    >
                                        <ExitIcon />
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    );
                })}
                <DeletionWarning
                    type="board member"
                    title={`${selectedMember?.first_name} ${selectedMember?.last_name}`}
                    deleteFunction={handleRemoveUser}
                    onClose={() => setShowDeletionWarning(false)}
                    show={showDeletionWarning}
                />
                <ConstructiveWarning
                    title="Promote this board member"
                    message={promoteWarningMessage}
                    callbackFn={handlePromoteToOwner}
                    onClose={() => setShowPromoteWarning(false)}
                    show={showPromoteWarning}
                />
                <ConstructiveWarning
                    title="Leave this board?"
                    message={leaveBoardMessage}
                    callbackFn={handleLeaveBoard}
                    onClose={() => setShowLeaveBoardWarning(false)}
                    show={showLeaveBoardWarning}
                />
                <AnimatePresence>
                    {isAddingMembers && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="relative"
                        >
                            <Input
                                onChange={onChangeUserSearch}
                                value={userSearchTerm}
                                placeholder="Search by name or exact email"
                            />
                            <DropDownContainer show={showSearchResults} additionalClassNames="top-18 w-full">
                                {filteredUserSearchResult
                                    ? filteredUserSearchResult.map(user => (
                                          <button
                                              type="button"
                                              onClick={handleAddUserToBoard(user)}
                                              className="dark:grey-light w-full rounded-t-xl px-[1.6rem] pb-[0.8rem] pt-[1.6rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                                          >
                                              {user.first_name} {user.last_name} - {user.email}
                                          </button>
                                      ))
                                    : null}
                            </DropDownContainer>
                        </motion.div>
                    )}
                </AnimatePresence>
                {isAbleToManageTeam && (
                    <Button variant="secondary" type="button" onClick={handleShowSearchInput}>
                        {isAddingMembers ? 'Close' : '+ Add New Team Member'}
                    </Button>
                )}
            </FormGroup>
        </>
    );
};

export default TeamMembers;
