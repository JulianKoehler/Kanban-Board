import { cn } from '@/util/combineStyles';
import React, { HTMLProps } from 'react';

interface AvatarProps extends HTMLProps<HTMLDivElement> {
    user: {
        firstName: string | undefined;
        lastName: string | undefined;
    };
    className?: HTMLProps<HTMLElement>['className'];
    [props: string]: any;
}

const Avatar = ({ user, className = '', ...props }: AvatarProps) => {
    const firstName = user.firstName ?? '';
    const lastName = user.lastName ?? '';
    const getUserInitials = () => firstName.charAt(0) + lastName.charAt(0);

    return (
        <div
            className={cn(
                'neumorphism tracking-tight flex h-[4rem] w-[4rem] cursor-pointer items-center justify-center rounded-full font-bold text-white',
                className,
            )}
            {...props}
        >
            {getUserInitials()}
        </div>
    );
};

export default Avatar;
