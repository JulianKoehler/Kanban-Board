import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import SanitizedHTML from 'react-sanitized-html';

const TaskDescription = () => {
    const { taskData } = useTaskModalContext();
    const { description } = taskData;

    return (
        <p className="text-base font-medium text-grey-medium">
            <SanitizedHTML
                allowedTags={['br', 'span']}
                html={`
                        <span>
                            ${description.replace(/\n/g, '<br>') || 'No further details.'}
                        </span>`}
            />
        </p>
    );
};

export default TaskDescription;
