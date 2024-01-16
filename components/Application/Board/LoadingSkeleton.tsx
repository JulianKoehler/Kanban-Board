import BoardLoadingSkeleton from '@/components/UI/LoadingSkeleton';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { PiWarningFill } from 'react-icons/pi';
import { useTimeout } from './LoadingSkeleton.hooks';

const LoadingSkeleton = () => {
    let skeletonTimeout: NodeJS.Timeout;
    let userFeedbackTimeout: NodeJS.Timeout;
    const DURATION_UNTIL_SKELETON = 1000;
    const DURATION_UNTIL_FEEDBACK = 6000;
    const showSkeleton = useTimeout(skeletonTimeout!, DURATION_UNTIL_SKELETON);
    const showUserFeedback = useTimeout(userFeedbackTimeout!, DURATION_UNTIL_FEEDBACK);

    const userFeedback = 'We apologize, this is taking longer than expected';

    if (!showSkeleton) {
        return null;
    }

    showUserFeedback &&
        toast(userFeedback, {
            duration: 5000,
            icon: <PiWarningFill className="text-3xl text-yellow-400 dark:text-yellow-200" />,
        });

    return (
        <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
            <BoardLoadingSkeleton count={4} />
        </motion.div>
    );
};

export default LoadingSkeleton;
