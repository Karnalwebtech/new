"use client";

import { Skeleton } from "@/components/ui/skeleton";
interface CheckListSkeletonProps {
isShadow?: boolean;
}
export default function CheckListSkeleton({isShadow=false}:CheckListSkeletonProps) {
  return (
    <div className={`w-full rounded-lg bg-white ${isShadow?"":"border max-w-xs p-4 shadow-sm"}`}>
      <div className="space-y-3">
        {/* Generate 6 skeleton items to match the example */}
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 border-b pb-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-full max-w-[180px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
