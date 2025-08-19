import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PolicyHolderSkeleton() {
    return (
        <Card className="p-4 relative">
            <CardHeader className="flex flex-col items-center">
                <Skeleton className="w-28 h-28 rounded-full" />
                <CardTitle>
                    <Skeleton className="w-32 h-6 mt-2" />
                </CardTitle>
                <div className="absolute left-2 top-2 flex flex-col gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>
                <div className="absolute right-2 top-2 flex gap-2">
                    <Skeleton className="h-8 w-6" />
                    <Skeleton className="h-8 w-6" />
                    <Skeleton className="h-8 w-6" />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                </div>
            </CardContent>
        </Card>
    );
}
