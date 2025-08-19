import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeletonFullRow() {
    return (
        <div className="border-b border-gray-200">
            <div className=" p-4 gap-4">
                <div className="w-full flex items-center">
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        </div>
    )
}
