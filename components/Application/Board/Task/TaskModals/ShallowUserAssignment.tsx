import Dropdown from '@/components/UI/Dropdown/Dropdown';
import FormGroup from '@/components/UI/Formelements/FormGroup';
import H5 from '@/components/UI/Headings/H5';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskActionTypes } from '@/services/context/task-modal/types';
import { useAppSelector } from '@/services/redux/hooks';
import { selectActiveBoard } from '@/services/redux/slices/boardSlice';
import { UserInfoReturn } from '@/types/data/user';
import React from 'react';
import toast from 'react-hot-toast';

type ShallowUserAssignmentProps = {
    users: UserInfoReturn[];
};

const ShallowUserAssignment = ({ users }: ShallowUserAssignmentProps) => {
    const {
        dispatchTask,
        taskData: { assignedUser },
    } = useTaskModalContext();
    const activeBoard = useAppSelector(selectActiveBoard);
    const assignedUserName = `${assignedUser?.first_name} ${assignedUser?.last_name}`;

    if (!activeBoard || !users) {
        console.debug({ activeBoard, users });
        return null;
    }

    function handleAssignmentChange(value: string, label: string) {
        const userToBeAssinged = users.find(user => user.id === value) ?? null;

        if (!userToBeAssinged) {
            toast.error(`Assignment failed! User ${label} with ID ${value} not found.`);
            return;
        }

        dispatchTask({ type: TaskActionTypes.SET_ASSIGNED_USER, payload: { user: userToBeAssinged } });
    }

    return (
        <FormGroup>
            <H5>Assigned User</H5>
            <Dropdown selected={assignedUser ? assignedUserName : ''} onChangeCallback={handleAssignmentChange}>
                {users.map(user => (
                    <Dropdown.Option key={user.id} value={user.id}>
                        {user.first_name + ' ' + user?.last_name}
                    </Dropdown.Option>
                ))}
            </Dropdown>
        </FormGroup>
    );
};

export default ShallowUserAssignment;
