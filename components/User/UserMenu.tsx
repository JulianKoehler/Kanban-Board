import React, { useRef, useState } from 'react';
import Avatar from '../UI/Avatar';
import DropDownContainer from '../UI/DropDown/DropDownContainer';
import useMenuHandler from '@/hooks/useMenuHandler';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setActiveBoard } from '@/redux/slices/boardSlice';
import { toast } from 'react-hot-toast';
import { TiUserDelete } from 'react-icons/ti';
import { SlLogout } from 'react-icons/sl';
import { useRouter } from 'next/navigation';
import DeletionWarning from '../UI/Modal/DeletionWarning';
import { logout, selectUser } from '@/redux/slices/authSlice';
import { restApi } from '@/redux/api';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { HTTPExceptionResponse } from '@/redux/api/auth/types';

const UserMenu = () => {
    const dispatch = useAppDispatch();
    const { push } = useRouter();
    const [signOut, signOutResult] = restApi.auth.useLogoutMutation();
    const [deleteUser, deleteUserResult] = restApi.users.useDeleteUserAccountMutation();

    const [showDeleteAccountWarning, setShowDeleteAccountWarning] = useState(false);
    const user = useAppSelector(selectUser);

    const userName = { firstName: user?.first_name, lastName: user?.last_name };
    const userMenuRef = useRef<HTMLDivElement>(null);
    const { showElement: showUserMenu, setShowElement: setShowUserMenu } = useMenuHandler(userMenuRef);

    async function handleLogout() {
        await signOut();
        if (signOutResult.isError) {
            toast.error('Could not logout: ' + signOutResult.error);
        } else {
            dispatch(setActiveBoard(undefined));
            dispatch(logout());
            push('/login');
        }
    }

    async function handleAccountDeletion() {
        try {
            await deleteUser().unwrap();
            dispatch(setActiveBoard(undefined));
            dispatch(logout());
            push('/login');
        } catch (error) {
            toast.error(((error as FetchBaseQueryError).data as HTTPExceptionResponse).detail);
        }
    }

    return (
        <div id="dropdown-menu" ref={userMenuRef}>
            {user && <Avatar onClick={() => setShowUserMenu(prev => !prev)} user={userName} />}
            <DropDownContainer show={showUserMenu} additionalClassNames="absolute right-0 top-[6rem]">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center rounded-t-xl px-[1.6rem] pb-[0.8rem] pt-[1.6rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    Logout <SlLogout className="ml-3 text-purple-main" />
                </button>
                <button
                    onClick={() => setShowDeleteAccountWarning(true)}
                    className="flex items-center rounded-b-xl px-[1.6rem] pb-[1.6rem] pt-[0.8rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    Delete Account <TiUserDelete className="ml-3" />
                </button>
            </DropDownContainer>

            <DeletionWarning
                show={showDeleteAccountWarning}
                title={''}
                type="user"
                onClose={() => setShowDeleteAccountWarning(false)}
                deleteFunction={handleAccountDeletion}
                isLoading={deleteUserResult.isLoading}
            />
        </div>
    );
};

export default UserMenu;
