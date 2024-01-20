import Dropdown from '@/components/UI/Dropdown/Dropdown';
import { useCurrentBoardIdContext } from '@/services/context/active-board/active-board-context';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { restApi } from '@/services/redux/api';
import { StageResponse, Status } from '@/types/data/stages';
import toast from 'react-hot-toast';
import TaskPresentation from './TaskPresentation';

type TaskStatusProps = {
    stages: Status[];
};

const TaskStatus = ({ stages }: TaskStatusProps) => {
    const [updateStage, stageUpdateResult] = restApi.tasks.useUpdateStageMutation();
    const { taskData, setActiveModal } = useTaskModalContext();
    const { status } = taskData;
    const { currentBoardId: boardId } = useCurrentBoardIdContext();

    async function handleStatusChange(stageId: StageResponse['id']) {
        await updateStage({
            taskId: taskData.id,
            prevStageId: taskData.status.id,
            newStageId: stageId,
            boardId,
        });

        if (!stageUpdateResult.isLoading && stageUpdateResult.isError) {
            toast.error('Could not update the task status.');
            return;
        }

        setActiveModal(null);
    }

    return (
        <TaskPresentation.Section className="flex flex-col gap-[1.6rem]">
            <h4 className="text-sm font-bold text-grey-medium">Current Status</h4>
            <Dropdown selected={status.title} onChangeCallback={handleStatusChange}>
                {stages.map(({ id, title }) => (
                    <Dropdown.Option key={id} value={id}>
                        {title}
                    </Dropdown.Option>
                ))}
            </Dropdown>
        </TaskPresentation.Section>
    );
};

export default TaskStatus;
