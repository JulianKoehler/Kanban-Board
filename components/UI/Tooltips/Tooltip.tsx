import { ReactNode } from 'react';

type TooltipProps = {
    children: ReactNode;
};

const Tooltip = ({ children }: TooltipProps) => {
    return (
        <div className="absolute -right-12 top-12 z-10 scale-0 rounded-lg bg-gray-500 px-4 py-2 text-lg text-white transition-transform duration-200 group-hover:scale-100">
            {children}
        </div>
    );
};

export default Tooltip;
