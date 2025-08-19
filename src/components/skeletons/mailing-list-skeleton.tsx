import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export function MailingListSkeleton() {
  return (
    <Card className="w-full p-4 rounded-xl border shadow-sm">
      <CardHeader >  
       <div className="space-y-2 flex justify-between w-full">
       <div className="w-[80%] space-y-2">
       <Skeleton className="h-5 w-3/4" /> {/* Name */}
        <Skeleton className="h-4 w-2/3" /> {/* Email */}
       </div>
       <div className="w-[20%] flex justify-end items-center">
        <Skeleton className="h-8 w-[50px]" /> {/* Timestamp */}

       </div>
       </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-1/3" /> {/* Subscribers icon + text */}
        <div className="flex gap-2 justify-end">
          <Skeleton className="h-8 w-16 rounded-md" /> {/* Tag button */}
          <Skeleton className="h-8 w-12 rounded-md" /> {/* Edit */}
          <Skeleton className="h-8 w-14 rounded-md" /> {/* Export */}
        </div>
      </CardContent>
    </Card>
  )
}
