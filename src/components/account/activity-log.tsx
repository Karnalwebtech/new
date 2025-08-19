"use client"

import { format } from "date-fns"
import { Activity, LogIn, LogOut, Settings, User } from "lucide-react"

interface ActivityItem {
  id: string
  type: "LOGIN" | "LOGOUT" | "UPDATE" | "SETTINGS"
  timestamp: Date
  details: string
  ip?: string
}

interface ActivityLogProps {
  activities: ActivityItem[]
}

const iconMap = {
  LOGIN: LogIn,
  LOGOUT: LogOut,
  UPDATE: User,
  SETTINGS: Settings,
}

export function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type]

          return (
            <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-4">
              <div className="rounded-full bg-muted p-2">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.details}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <time>{format(activity.timestamp, "PPpp")}</time>
                  {activity.ip && (
                    <>
                      <span>•</span>
                      <span>IP: {activity.ip}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

