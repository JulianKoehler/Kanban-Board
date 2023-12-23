import { SlLogout } from 'react-icons/sl';
import Tooltip from '../Tooltips/Tooltip';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    showToolTip?: boolean;
}

/**
 * For the tooltip to work properly you need to set the tailwind class "group" and "relative"
 * from outside this component
 */

const LogoutBtn = ({ showToolTip, ...btnProps }: ButtonProps) => {
    return (
        <button {...btnProps}>
            <SlLogout className="text-purple-main" />
            {showToolTip && <Tooltip message='Logout'>Logout</Tooltip>}
        </button>
    );
};

export default LogoutBtn;
