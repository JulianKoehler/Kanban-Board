import { cn } from '@/util/combineStyles';

/**
 * The "large"-Prop refers to the height and fontSize of the button, not the width. The buttons
 * that are not large actually are the full-width buttons.
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    large?: boolean;
    variant?: 'primary' | 'secondary' | 'destructive';
}

const Button = ({ children, className, variant = 'primary', large = false, ...rest }: ButtonProps) => {
    const textColor = variant === 'secondary' ? 'text-purple-main' : 'text-white';
    const fontSize = large ? 'text-lg' : 'text-base';
    const paddingY = large ? 'py-[1.5rem]' : 'py-[0.8rem]';
    const width = large ? '' : 'w-full';

    const getBgColor = () => {
        switch (variant) {
            case 'primary':
                return 'bg-purple-main hover:bg-purple-main-hover disabled:cursor-not-allowed';
            case 'secondary':
                return 'dark:bg-white bg-button-secondary-lightmode-idle hover:bg-button-secondary-lightmode-hover';
            case 'destructive':
                return 'bg-red hover:bg-red-hover';
            default:
                return '';
        }
    };

    return (
        <button
            {...rest}
            className={cn(
                'rounded-[2.4rem] px-[1.8rem] font-bold',
                textColor,
                fontSize,
                paddingY,
                width,
                getBgColor(),
                className,
            )}
        >
            {children}
        </button>
    );
};

export default Button;
