import { DashboardHeader } from "@/modules/upstash-redis/dashboard/dashboard-header"
import { InstancesOverview } from "@/modules/upstash-redis/dashboard/instances-overview"
import { OverviewStats } from "@/modules/upstash-redis/dashboard/overview-stats"
import { PerformanceChart } from "@/modules/upstash-redis/dashboard/performance-chart"
import { RecentActivity } from "@/modules/upstash-redis/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader heading="Dashboard" text="Monitor and manage your Upstash Redis instances." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewStats />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <PerformanceChart className="lg:col-span-4" />
        <RecentActivity className="lg:col-span-3" />
      </div>
      <div className="mt-4">
        <InstancesOverview />
      </div>
      </>
  )
}
