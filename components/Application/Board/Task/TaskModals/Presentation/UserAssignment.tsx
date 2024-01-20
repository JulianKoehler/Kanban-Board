import Dropdown from '@/components/UI/Dropdown/Dropdown';
import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskActionTypes } from '@/services/context/task-modal/types';
import { restApi } from '@/services/redux/api';
import { UserInfoReturn, UserReturn } from '@/types/data/user';
import toast from 'react-hot-toast';
import TaskPresentation from './TaskPresentation';

type UserAssignmentProps = {
    users: UserInfoReturn[];
};

const UserAssignment = ({ users }: UserAssignmentProps) => {
    const [updateAssingedUser, assignmentResult] = restApi.tasks.useUpdateAssingedUserMutation();
    const { taskData, dispatchTask } = useTaskModalContext();
    const { assignedUser: assingedUser, id } = taskData;
    const { currentBoardId: boardId } = useCurrentBoardIdContext();

    const assignedUserName = assingedUser?.first_name + ' ' + assingedUser?.last_name;

    async function handleChangeAssignedUser(userId: UserReturn['id']) {
        await updateAssingedUser({ taskId: id, assignedUserId: userId, boardId });

        if (!assignmentResult.isLoading && assignmentResult.isError) {
            toast.error('Could not assign the task, please try again.');
            console.error(assignmentResult.error);
            return;
        }

        const user = users.find(user => user.id === userId);
        if (!user) {
            console.debug('Could not update context state: ', { users, userId });
            return;
        }

        dispatchTask({ type: TaskActionTypes.SET_ASSIGNED_USER, payload: { user } });
    }

    return (
        <TaskPresentation.Section>
            <h4 className="text-sm font-bold text-grey-medium">Assinged To:</h4>
            <Dropdown selected={assingedUser ? assignedUserName : ''} onChangeCallback={handleChangeAssignedUser}>
                {users.length > 0 &&
                    users!.map(user => (
                        <Dropdown.Option key={user.id} value={user.id}>
                            {user?.first_name + ' ' + user?.last_name}
                        </Dropdown.Option>
                    ))}
            </Dropdown>
        </TaskPresentation.Section>
    );
};

export default UserAssignment;
