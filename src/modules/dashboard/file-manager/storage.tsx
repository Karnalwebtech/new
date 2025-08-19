"use client";
import { ParaSkeleton } from "@/components/skeletons/para-skeleton";
import { Progress } from "@/components/ui/progress";
import { useGetStorageQuery } from "@/state/drive-api";
import { Database } from "lucide-react";
import Link from "next/link";
import React, { memo } from "react";

const Storage = () => {
  const { data, isLoading, error } = useGetStorageQuery();
  const result = data?.result;

  const usedStorage = Number(result?.usedStorage) || 0;
  const totalStorage = Number(result?.totalStorage) || 1; // Avoid division by zero
  const progressValue = (usedStorage / totalStorage) * 100;

  if (error) {
    return <p className="text-sm text-red-500">Failed to load storage data.</p>;
  }

  return (
    <div className="px-6">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold tracking-tight">Storage</h2>
        <div className="flex items-center text-sm">
          <Database className="mr-2 h-4 w-4" />
          <div className="flex items-center text-sm gap-[4px]">
            {isLoading ? (
              <ParaSkeleton />
            ) : (
              <>
                <span className="font-medium">{usedStorage.toFixed(2)}</span>
                <span className="text-muted-foreground">
                  of {totalStorage} MB
                </span>
              </>
            )}
          </div>
        </div>
        <Progress
          value={progressValue}
          className="h-2"
          aria-valuenow={progressValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
        <div className="text-sm flex gap-4">
          <div>Get free storage</div>
          <Link href={"/dashboard/storage"} className="text-blue-900">
            View more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(Storage);
