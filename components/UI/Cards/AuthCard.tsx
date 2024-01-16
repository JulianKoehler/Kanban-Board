import { ReactNode } from 'react';

type AuthCarProps = {
    children: ReactNode;
    className?: string;
};

const AuthCard = ({ children, className }: AuthCarProps) => {
    return (
        <div
            className={`absolute left-[50%] top-[50%] flex w-[64rem] translate-x-[-50%] translate-y-[-50%] rounded-[3.4rem] bg-white p-24 shadow-md-light dark:bg-grey-very-dark ${className}`}>
            {children}
        </div>
    );
};

export default AuthCard;
