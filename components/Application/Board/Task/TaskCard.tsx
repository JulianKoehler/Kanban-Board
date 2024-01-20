import Avatar from '@/components/UI/Avatar';
import { useTaskModalContext } from '@/services/context/task-modal/task-modal-context';
import { TaskModalType } from '@/services/context/task-modal/types';
import getSubtaskHeadline from '@/util/getSubtaskHeadline';
import { motion } from 'framer-motion';

type TaskCardProps = {
    index: number;
};

const TaskCard = ({ index }: TaskCardProps) => {
    const { taskData, setActiveModal } = useTaskModalContext();
    const { title, subtasks, assignedUser } = taskData;
    const subtaskHeadline = getSubtaskHeadline(subtasks);

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
                type: 'spring',
                duration: 0.3,
                delay: index * 0.1,
            }}
            onClick={() => setActiveModal(TaskModalType.PRESENTATION)}
            className="group relative flex max-w-[28rem] cursor-pointer items-end rounded-xl bg-white px-[1.6rem] py-[2.3rem] shadow-md hover:z-30 dark:bg-grey-dark dark:shadow-md-dark">
            <div className="flex flex-col gap-[0.8rem]">
                <h3 className="text-lg font-bold group-hover:text-purple-main ">{title}</h3>
                <p className="text-sm font-bold text-grey-medium">{subtaskHeadline}</p>
            </div>
            {assignedUser && (
                <Avatar
                    className="absolute bottom-4 right-4 h-[3rem] w-[3rem] text-sm"
                    user={{
                        firstName: assignedUser?.first_name,
                        lastName: assignedUser?.last_name,
                    }}
                />
            )}
        </motion.div>
    );
};

export default TaskCard;
