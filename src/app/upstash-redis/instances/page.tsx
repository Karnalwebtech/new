import { Header } from "@/modules/layout/header/header"
import RedisInstances from "@/modules/upstash-redis/redis-instances"

export default function InstancesPage() {
  return (
    <div>
       
            <Header
              breadcrumbData={[
                { label: "Upstash redis", path: "/upstash-redis" },
                { label: "Redis instances", path: "/upstash-redis/instances" },
              ]}
            />
      {/* for titlee */}
      {/* <DashboardHeader heading="Redis Instances" text="Manage your Upstash Redis instances.">
        <Link href="/dashboard/instances/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Instance
          </Button>
        </Link>
      </DashboardHeader> */}
      <RedisInstances/>
    </div>
  )
}
