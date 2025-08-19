import { Header } from "@/modules/layout/header/header";
import { DashboardHeader } from "@/modules/upstash-redis/dashboard/dashboard-header";
import { EventsTable } from "@/modules/upstash-redis/dashboard/events-table";

export default function EventsPage() {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Upstash redis", path: "/upstash-redis" },
          { label: "Events instances", path: "/upstash-redis/events" },
        ]}
      />
      <DashboardHeader heading="Events Log" text="Monitor and manage Redis events across your instances." />
      <EventsTable />
    </>
  )
}
