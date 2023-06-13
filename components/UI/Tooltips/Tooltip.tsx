import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Tooltip = ({ children }: Props) => {
  return (
    <div className="absolute top-12 -right-12 z-10 scale-0 rounded-lg bg-gray-500 py-2 px-4 text-lg text-white transition-transform duration-200 group-hover:scale-100">
      {children}
    </div>
  );
};

export default Tooltip;
