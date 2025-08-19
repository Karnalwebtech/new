import { Skeleton } from "@/components/ui/skeleton"

export function ImageCardSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-[250px] rounded-xl" />
            <div className="space-y-4">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>
        </div>
    )
}
