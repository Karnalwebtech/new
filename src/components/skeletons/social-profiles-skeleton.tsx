import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SocialProfilesSkeleton({ length = 4 }: { length?: number }) {
    // Create an array of 2 items to match the example
    const skeletonItems = Array.from({ length: length }, (_, i) => i)

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4 p-0 lg:p-4">
            {skeletonItems.map((index) => (
                <Card key={index} className="p-2 lg:p-6">
                    <div className="lg:flex items-start space-y-4 justify-between">
                        <div className="lg:flex items-start space-x-4 space-y-4 lg:space-y-0 ">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-56" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden lg:flex items-center space-x-2">
                                <Skeleton className="h-4 w-10" />
                                <Skeleton className="h-5 w-10 rounded-full" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

