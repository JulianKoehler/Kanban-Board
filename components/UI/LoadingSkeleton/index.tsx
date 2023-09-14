import React from "react";
import Skeleton from "react-loading-skeleton";

type Props = {
  count: number
};

const LoadingSkeleton = ({ count }: Props) => {
  const columnCount = Array(count).fill(0);

  return (
    <div id="outmost-wrapper" className="flex h-full gap-[2.4rem] px-[1.6rem]">
      {columnCount.map((_) => (
        <div id="column-wrapper" className="w-[28rem]">
          <div id="top-section" className="flex gap-4">
            <div id="circle" className="h-6 w-[1.5rem]">
              <Skeleton circle />
            </div>
            <div id="headline" className="w-1/2">
              <Skeleton borderRadius={6} className="h-7 w-full" />
            </div>
          </div>
            <div id="task-section" className="mt-6 h-5/6">
              <Skeleton className="h-full" borderRadius={8} />
            </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
