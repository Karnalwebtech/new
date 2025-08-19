import { Header } from "@/modules/layout/header/header";
import { DashboardHeader } from "@/modules/upstash-redis/dashboard/dashboard-header";
import { RedisManagementTabs } from "@/modules/upstash-redis/dashboard/redis-management-tabs";

export default function ManagePage() {  
  return (
    // <DashboardShell>
    <>
      <Header
        breadcrumbData={[
          { label: "Upstash redis", path: "/upstash-redis" },
          { label: "Manage", path: "/upstash-redis/manage" },
        ]}
      />
      <DashboardHeader heading="Redis Management" text="Manage your Redis data, cache, and monitor memory usage." />
      <RedisManagementTabs />
    </>
    // </DashboardShell>
  )
}
