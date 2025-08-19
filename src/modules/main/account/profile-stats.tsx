import { BarChart, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@/types/user-type"
import { formatDate } from "@/services/helpers";
interface ProfileStatsProps {
  user: User;
}
export function ProfileStats({ user }: ProfileStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Login</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDate(user?.updatedAt || "")}</div>
          <p className="text-xs text-muted-foreground">{formatDate(user?.updatedAt || "", "long", true)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Account Age</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDate(user?.createdAt)}</div>
          <p className="text-xs text-muted-foreground">{formatDate(user?.createdAt, "long", true)}</p>
        </CardContent>
      </Card>
    </div>
  )
}

