import type React from "react"
import { BarChart3, FileText, MessageSquare, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Posts" value="124" description="+12 this week" icon={FileText} trend="up" />
      <StatCard title="Projects" value="38" description="+4 this month" icon={BarChart3} trend="up" />
      <StatCard title="Contacts" value="89" description="+7 this week" icon={MessageSquare} trend="up" />
      <StatCard title="Users" value="1,203" description="+43 this month" icon={Users} trend="up" />
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  description: string
  icon: React.ElementType
  trend: "up" | "down" | "neutral"
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

