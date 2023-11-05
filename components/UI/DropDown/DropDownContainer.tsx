import { cn } from "@/util/combineStyles";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

type Props = {
  additionalClassNames?: string;
  show: boolean;
  children: React.ReactNode;
};

export type RefDiv = HTMLDivElement;

const DropDownContainer = React.forwardRef<RefDiv, Props>(
  ({ children, additionalClassNames = "", show }, ref) => {
    return (
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            ref={ref}
            className={cn(
              "absolute z-10 flex h-fit w-fit min-w-[19.2rem] flex-col rounded-xl bg-white p-0 shadow-sm dark:bg-grey-very-dark",
              additionalClassNames
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

export default DropDownContainer;
