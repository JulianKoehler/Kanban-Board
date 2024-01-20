import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import getSubtaskHeadline from '@/util/getSubtaskHeadline';
import SubtaskCheckbox from '../../../Subtask/SubtaskCheckbox';
import TaskPresentation from './TaskPresentation';

const Subtasks = () => {
    const { taskData } = useTaskModalContext();
    const { subtasks } = taskData;

    const subtaskHeadline = getSubtaskHeadline(subtasks);

    return (
        <TaskPresentation.Section>
            <h4 className="mb-[0.8rem] text-sm font-bold text-grey-medium">{subtaskHeadline}</h4>
            {subtasks.map((subtask, index) => (
                <SubtaskCheckbox key={subtask.id} index={index} />
            ))}
        </TaskPresentation.Section>
    );
};

export default Subtasks;
