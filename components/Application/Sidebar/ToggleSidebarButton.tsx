import { HTMLAttributes } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectShowSidebar, setShowSidebar } from '@/redux/slices/boardSlice';
import HideIcon from '@/components/UI/Icons/HideIcon';
import UnhideIcon from '@/public/assets/icon-show-sidebar.svg';

const ToggleSidebarButton = () => {
    const dispatch = useAppDispatch();
    const showSidebar = useAppSelector(selectShowSidebar);
    const Button = showSidebar ? HideSidebarButton : UnhideSidebarButton;

    return <Button onClick={() => dispatch(setShowSidebar(!showSidebar))} />;
};

const HideSidebarButton = ({ ...props }: HTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            {...props}
            className="relative left-[-2.4rem] flex items-center gap-[1.6rem] rounded-r-[2.4rem] fill-grey-medium py-[1.4rem] pl-[3.2rem] text-lg font-bold text-grey-medium transition-colors duration-300 hover:bg-button-secondary-lightmode-idle hover:fill-purple-main hover:text-purple-main dark:hover:bg-white"
        >
            <HideIcon />
            Hide Sidebar
        </button>
    );
};

const UnhideSidebarButton = ({ ...props }: HTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            {...props}
            className="absolute bottom-[3.2rem] right-[-5.6rem] z-10 flex h-[4.8rem] w-[5.6rem] items-center justify-center rounded-r-full bg-purple-main hover:bg-purple-main-hover "
        >
            <Image src={UnhideIcon} alt="Unhide Sidebar" />
        </button>
    );
};

export default ToggleSidebarButton;
