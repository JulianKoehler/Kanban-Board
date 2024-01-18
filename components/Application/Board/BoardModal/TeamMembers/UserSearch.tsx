import Button from '@/components/UI/Button/Button';
import DropdownContainer from '@/components/UI/Dropdown/DropdownContainer';
import Input from '@/components/UI/InputFields/TextInput';
import { useBoardModalContext } from '@/services/context/board-modal/board-modal-context';
import { ActionTypes } from '@/services/context/board-modal/types';
import { restApi } from '@/services/redux/api';
import { ContributorUpdate } from '@/types/data/user';
import debounce from '@/util/debounce';
import { AnimatePresence, motion } from 'framer-motion';
import { ChangeEvent, useMemo, useState } from 'react';

type UserSearchProps = {
    show: boolean;
    allowToggle: boolean;
    onClose: () => void;
};

const UserSearch = ({ show, allowToggle, onClose }: UserSearchProps) => {
    const { boardData, dispatchBoard } = useBoardModalContext();
    const { contributors } = boardData;

    const [searchUsers, userSearchResult] = restApi.users.useLazySearchAllUsersQuery();

    const [showSearchResults, setShowSearchResults] = useState(false);
    const [userSearchTerm, setUserSearchTerm] = useState('');

    const filteredUserSearchResult = useMemo(
        () =>
            userSearchResult.data?.filter(
                user => !contributors.some(contributor => contributor.id === user.id && !contributor.markedForDeletion),
            ),
        [userSearchResult.data],
    );

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

    function toggleSearchBar() {
        setShowSearchResults(false);
        setUserSearchTerm('');
        onClose();
    }

    function handleAddUserToBoard(user: ContributorUpdate) {
        dispatchBoard({ type: ActionTypes.ADD_CONTRIBUTOR, payload: { user } });
        setUserSearchTerm('');
        setShowSearchResults(false);
    }

    return (
        <>
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="relative">
                        <Input
                            onChange={onChangeUserSearch}
                            value={userSearchTerm}
                            placeholder="Search by name or exact email"
                        />
                        <DropdownContainer show={showSearchResults} className="top-18 w-full">
                            {filteredUserSearchResult
                                ? filteredUserSearchResult.map(user => (
                                      <button
                                          key={user.id}
                                          type="button"
                                          onClick={() => handleAddUserToBoard(user)}
                                          className="dark:grey-light w-full rounded-t-xl px-[1.6rem] pb-[0.8rem] pt-[1.6rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                                          {user.first_name} {user.last_name} - {user.email}
                                      </button>
                                  ))
                                : null}
                        </DropdownContainer>
                    </motion.div>
                )}
            </AnimatePresence>
            {allowToggle && (
                <Button variant="secondary" type="button" onClick={toggleSearchBar}>
                    {show ? 'Close' : '+ Add New Team Member'}
                </Button>
            )}
        </>
    );
};

export default UserSearch;
