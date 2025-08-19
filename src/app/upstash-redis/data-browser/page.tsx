import { DashboardHeader } from "@/modules/upstash-redis/dashboard/dashboard-header";
import { DataBrowser } from "@/modules/upstash-redis/dashboard/data-browser";
import { InstanceSelector } from "@/modules/upstash-redis/dashboard/instance-selector";

export default function DataBrowserPage() {
  return (
    // <DashboardShell>
      <>
      <DashboardHeader heading="Data Browser" text="Browse and manage your Redis data." />
      <InstanceSelector />
      <DataBrowser />
    </>
    // </DashboardShell>
  )
}
