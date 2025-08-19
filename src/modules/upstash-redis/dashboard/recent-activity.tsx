"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecentActivityProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RecentActivity({ className, ...props }: RecentActivityProps) {
  const recentEvents = [
    {
      id: 1,
      type: "SET",
      key: "user:1001",
      instance: "main-db",
      timestamp: "2 mins ago",
      status: "success",
    },
    {
      id: 2,
      type: "GET",
      key: "session:abc123",
      instance: "session-db",
      timestamp: "5 mins ago",
      status: "success",
    },
    {
      id: 3,
      type: "DEL",
      key: "cache:products",
      instance: "cache-db",
      timestamp: "10 mins ago",
      status: "success",
    },
    {
      id: 4,
      type: "HSET",
      key: "user:1002:profile",
      instance: "main-db",
      timestamp: "15 mins ago",
      status: "success",
    },
    {
      id: 5,
      type: "EXPIRE",
      key: "token:xyz789",
      instance: "auth-db",
      timestamp: "20 mins ago",
      status: "warning",
    },
    {
      id: 6,
      type: "LPUSH",
      key: "queue:emails",
      instance: "queue-db",
      timestamp: "25 mins ago",
      status: "success",
    },
    {
      id: 7,
      type: "ZADD",
      key: "leaderboard",
      instance: "game-db",
      timestamp: "30 mins ago",
      status: "error",
    },
  ]

  return (
    <Card className={cn("col-span-3", className)} {...props}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Recent Redis operations across your instances.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm font-medium leading-none">
                    {event.type} <span className="text-muted-foreground">{event.key}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.instance} • {event.timestamp}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  event.status === "success" ? "default" : event.status === "warning" ? "outline" : "destructive"
                }
              >
                {event.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
