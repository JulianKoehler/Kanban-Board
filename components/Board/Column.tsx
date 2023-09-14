import { ColumnProps } from "@/types/component-props/column.model";
import { motion } from "framer-motion";

const Column = ({ column, children }: ColumnProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.05
      }}
      className="h-fit min-w-[28rem] max-w-[28rem]"
    >
      <div className="flex gap-3">
        <div
          className={`inline-block h-6 min-w-[1.5rem] rounded-full align-middle`}
          style={{ backgroundColor: column.color }}
        />
        <h4 className="mb-[2.4rem] inline-block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold tracking-wide text-grey-medium">
          {column.name}
        </h4>
        <span className="text-sm font-bold tracking-wide text-grey-medium">
          ({column.tasks?.length || 0})
        </span>
      </div>
      <div className="flex flex-col gap-8">{children}</div>
    </motion.div>
  );
};

export default Column;
