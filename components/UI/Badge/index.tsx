import { cn } from '@/util/combineStyles';
import { capitalize } from '@/util/stringUtil';

type BadgeProps = {
    userType: 'owner' | 'member';
    className?: string;
};

const Badge = ({ userType, className = '' }: BadgeProps) => {
    let badgeColor = '';
    let fontColor = ''

    switch (userType) {
        case 'owner':
            badgeColor = 'bg-purple-main';
            fontColor = 'text-white'
            break;
        case 'member':
            badgeColor = 'bg-button-secondary-lightmode-idle';
            fontColor = 'text-purple-main'
            break;
        default:
            break;
    }

    return (
        <div className={cn(badgeColor, fontColor, 'inline-block text-sm rounded-full px-4 py-2 font-bold', className)}>
            {capitalize(userType)}
        </div>
    );
};

export default Badge