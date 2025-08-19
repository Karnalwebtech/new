"use client"

import { RecentActivity } from "@/components/cards/recent-activity"
import { MostVisitedPages } from "./most-visited-pages"
import { StatsCards } from "./stats-cards"

export function DashboardPage() {
  return (
      <div className="flex flex-col gap-6 p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <StatsCards />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MostVisitedPages />
          <RecentActivity />
        </div>
      </div>
  )
}

