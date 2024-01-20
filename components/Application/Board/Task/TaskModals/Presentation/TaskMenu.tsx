import MenuActionButton from '@/components/UI/Button/Menu/MenuActionButton';
import MenuToggleButton from '@/components/UI/Button/Menu/MenuToggleButton';
import DropdownContainer from '@/components/UI/Dropdown/DropdownContainer';
import useMenuHandler from '@/hooks/useMenuHandler';
import OptionsIcon from '@/public/assets/icon-vertical-ellipsis.svg';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import Image from 'next/image';
import { useRef } from 'react';

const TaskMenu = () => {
    const { setActiveModal } = useTaskModalContext();

    const menuRef = useRef<HTMLDivElement>(null);
    const { showElement: showEditTaskMenu, setShowElement: setShowEditTaskMenu } = useMenuHandler(menuRef);

    return (
        <div id="menu-dropdown" className="" ref={menuRef}>
            <MenuToggleButton onClick={() => setShowEditTaskMenu(prevState => !prevState)}>
                <Image src={OptionsIcon} alt="options" />
            </MenuToggleButton>
            <DropdownContainer show={showEditTaskMenu} className="right-0 top-[4.2rem]">
                <MenuActionButton onClick={() => setActiveModal('EDITING')} className="rounded-t-xl">
                    Edit Task
                </MenuActionButton>
                <MenuActionButton
                    onClick={() => setActiveModal('DELETION_WARNING')}
                    className="rounded-b-xl pb-[1.6rem] pt-[0.8rem] text-red">
                    Delete Task
                </MenuActionButton>
            </DropdownContainer>
        </div>
    );
};

export default TaskMenu;
