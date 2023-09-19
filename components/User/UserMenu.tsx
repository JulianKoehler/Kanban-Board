import React, { useRef, useState } from "react";
import Avatar from "../UI/Avatar";
import { useDeleteUser, useSignOut } from "react-firebase-hooks/auth";
import DropDownContainer from "../UI/DropDown/DropDownContainer";
import useMenuHandler from "@/hooks/useMenuHandler";
import { auth } from "@/firebase/config";
import localStorageIdentifiers from "@/util/localStorageIdentifiers";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveBoard } from "@/redux/slices/boardSlice";
import { toast } from "react-hot-toast";
import { TiUserDelete } from "react-icons/ti";
import { SlLogout } from "react-icons/sl";
import { useRouter } from "next/router";
import DeletionWarning from "../UI/Modal/DeletionWarning";
import { logout, selectUser } from "@/redux/slices/authSlice";

type Props = {};

const UserMenu = ({}: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [deleteUser, deletingUser, errorUserDeletion] = useDeleteUser(auth);
  const [showDeleteAccountWarning, setShowDeleteAccountWarning] =
    useState(false);
  const user = useAppSelector(selectUser);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [signOut, _, errorLogout] = useSignOut(auth);
  const { showElement: showUserMenu, setShowElement: setShowUserMenu } =
    useMenuHandler(userMenuRef);

  async function handleLogout() {
    await signOut();
    if (!errorLogout) {
      localStorage.removeItem(localStorageIdentifiers.activeBoard);
      dispatch(setActiveBoard(undefined));
      dispatch(logout());
      router.push("/login");
    } else {
      toast.error("Could not logout: " + errorLogout);
    }
  }

  async function handleAccountDeletion() {
    await deleteUser();
    if (errorUserDeletion) console.log(errorUserDeletion.cause);
  }

  return (
    <>
      {user && <Avatar onClick={() => setShowUserMenu(true)} user={user} />}
      {showUserMenu && (
        <DropDownContainer
          additionalClassNames="absolute right-0 top-[6rem]"
          ref={userMenuRef}
        >
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-t-xl px-[1.6rem] pt-[1.6rem] pb-[0.8rem] text-left text-base font-medium text-grey-medium hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Logout <SlLogout className="ml-3 text-purple-main" />
          </button>
          <button
            onClick={() => setShowDeleteAccountWarning(true)}
            className="flex items-center rounded-b-xl px-[1.6rem] pt-[0.8rem] pb-[1.6rem] text-left text-base font-medium text-red hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Delete Account <TiUserDelete className="ml-3" />
          </button>
        </DropDownContainer>
      )}

      <DeletionWarning
        showDeletionWarning={showDeleteAccountWarning}
        title={""}
        type="user"
        onClose={() => setShowDeleteAccountWarning(false)}
        deleteFunction={handleAccountDeletion}
        isLoading={deletingUser}
      />
    </>
  );
};

export default UserMenu;
