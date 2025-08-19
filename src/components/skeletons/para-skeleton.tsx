import { Skeleton } from "@/components/ui/skeleton"
interface ParaSkeletonProps {
  style?: string;
}
export function ParaSkeleton({ style = "h-4 w-[200px]" }: ParaSkeletonProps) {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className={style} />
    </div>
  )
}
