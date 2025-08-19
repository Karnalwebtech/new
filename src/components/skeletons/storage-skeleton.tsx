import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Cloud } from "lucide-react"

export default function StorageSkeleton() {
  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader className="space-y-2">
        <div className="flex items-center space-x-2">
          <Cloud className="h-5 w-5 text-muted-foreground" />
          <div className="font-medium">Google Drive Storage</div>
        </div>
        <div className="text-sm text-muted-foreground">Monitor your cloud storage usage</div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Storage bar section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="animate-pulse bg-muted rounded w-20 h-4" />
            <div className="animate-pulse bg-muted rounded w-24 h-4" />
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-[85%] animate-pulse bg-primary/50 rounded-full" />
          </div>
        </div>

        {/* Usage stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Drive Usage</div>
            <div className="animate-pulse bg-muted rounded w-16 h-4" />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Trash Usage</div>
            <div className="animate-pulse bg-muted rounded w-14 h-4" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="size-4 animate-pulse rounded-full bg-muted" />
          <div className="animate-pulse bg-muted rounded w-32 h-4" />
        </div>
      </CardContent>
    </Card>
  )
}

