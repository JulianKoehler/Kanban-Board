import React, { ChangeEvent, useMemo, useState } from 'react';
import FormGroup from '../UI/Formelements/FormGroup';
import H5 from '../UI/Headings/H5';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/authSlice';
import { restApi } from '@/redux/api';
import debounce from '@/util/debounce';
import { ContributorUpdate, UserInfoReturn } from '@/types/data/user';
import Avatar from '../UI/Avatar';
import { cn } from '@/util/combineStyles';
import Badge from '../UI/Badge';
import Tooltip from '../UI/Tooltips/Tooltip';
import DeleteIcon from '../UI/Icons/DeleteIcon';
import { AnimatePresence, motion } from 'framer-motion';
import DropDownContainer from '../UI/DropDown/DropDownContainer';
import Input from '../UI/InputFields/TextInput';
import Button from '../UI/Button';
import DeletionWarning from '../UI/Modal/DeletionWarning';
import PromoteIcon from '../UI/Icons/PromoteIcon';

type TeamMembersProps = {
    owner: UserInfoReturn;
    contributors: ContributorUpdate[];
    onAddContributor: (user: ContributorUpdate) => void;
    onRemoveContributor: (user: ContributorUpdate) => void;
};

const TeamMembers = ({ owner, contributors, onAddContributor, onRemoveContributor }: TeamMembersProps) => {
    const currentUser = useAppSelector(selectUser);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [searchUsers, userSearchResult] = restApi.users.useLazySearchAllUsersQuery();
    const [isAddingMembers, setIsAddingMembers] = useState(false);
    const [showDeletionWarning, setShowDeletionWarning] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const filteredUserSearchResult = useMemo(
        () =>
            userSearchResult.data?.filter(
                user => !contributors.some(contributor => contributor.id === user.id && !contributor.markedForDeletion),
            ),
        [userSearchResult.data],
    );
    const teamMembers = [owner, ...contributors.filter(member => !member?.markedForDeletion)];
    const isAbleToManageTeam = currentUser?.id === owner?.id;

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

    function handleRemoveUser(user: ContributorUpdate) {
        return () => {
            onRemoveContributor({ ...user, markedForDeletion: true });
            setShowDeletionWarning(false);
        };
    }

    function handleShowSearchInput() {
        setShowSearchResults(false);
        setUserSearchTerm('');
        setIsAddingMembers(bool => !bool);
    }

    return (
        <>
            <FormGroup additionalClasses="relative">
                <H5>Team members</H5>
                {teamMembers.map(member => {
                    const removable = isAbleToManageTeam && member.id !== owner.id;
                    const promotable = removable; // seperate in case in future I need different requirements
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
                                )}
                            >
                                {member.first_name + ' ' + member.last_name}
                            </span>
                            <Badge userType={member.id === owner.id ? 'owner' : 'member'} />
                            {promotable && (
                                <Tooltip className="ml-auto mt-1" message="Promote to Owner">
                                    <button
                                        type="button"
                                        onClick={() => alert('Work in progress!')}
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
                                        onClick={() => setShowDeletionWarning(true)}
                                        className="aspect-square w-[1.485rem] fill-grey-medium transition-colors duration-200 hover:fill-red"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </Tooltip>
                            )}
                            <DeletionWarning
                                type="board member"
                                title={`${member.first_name} ${member.last_name}`}
                                deleteFunction={handleRemoveUser(member)}
                                onClose={() => setShowDeletionWarning(false)}
                                show={showDeletionWarning}
                            />
                        </div>
                    );
                })}
                <AnimatePresence>
                    {isAddingMembers && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="relative"
                        >
                            <Input onChange={onChangeUserSearch} value={userSearchTerm} />
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
