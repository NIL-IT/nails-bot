import React from "react";

export default function SkeletonLoader({ count = 10 }) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="p-[6px] max-w-[145px]
             flex flex-col gap-[10px] bg-gray rounded-[10px] 
                w-[145px] h-full min-h-[189px]"
          >
            <div
              className="w-full h-[89px] bg-gray_dark
             rounded-[10px] animate-pulse"
            />

            <div
              className="flex flex-col justify-between 
            h-full gap-[10px]"
            >
              <div
                className="h-6 bg-gray_dark 
              rounded animate-pulse"
              />
              <div
                className="h-6 w-1/2 bg-gray_dark 
              rounded animate-pulse"
              />
            </div>
          </div>
        ))}
    </>
  );
}
