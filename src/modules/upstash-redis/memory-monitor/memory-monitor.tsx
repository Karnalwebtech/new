"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstanceSelector } from "../dashboard/instance-selector"
import MemoryUsageOverview from "./memory-usage-overview"
import { useGetUpstashRedisDBDetailsQuery } from "@/state/upstash-redis-api"
import MemoryDistributionByDataType from "./memory-distribution-by-data-type"
import KeyspaceStatistics from "./keyspace-statistics"
import DetailedMemoryStatistics from "./detailed-memory-statistics"
import { formatDate } from "@/services/helpers"
import { useHandleNotifications } from "@/hooks/use-notification-handler"
import Loader from "@/components/loader"

export function MemoryMonitor() {
  const { data, error, isLoading } = useGetUpstashRedisDBDetailsQuery({ id: "f9163d99-1989-469e-b903-82828242fd39" });
  const result = data?.result;
  useHandleNotifications({
    error: error,
  });

  return (
    <div className="space-y-6">
      <Card>
        {isLoading ?
          <CardContent className="min-h-[400px] flex items-center">
            <Loader />
          </CardContent>
          :
          <>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Memory Usage Monitor</CardTitle>
                <CardDescription>Monitor memory usage and statistics for your Redis instance</CardDescription>
              </div>
              {/* <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button> */}
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <InstanceSelector />
              </div>
              <div className="mb-6 text-sm text-muted-foreground">Last updated: {formatDate(result?.last_updated || "")}</div>
              <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <MemoryUsageOverview result={result!} />
              </div>
              <Tabs defaultValue="distribution" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="distribution">Data Type Distribution</TabsTrigger>
                  <TabsTrigger value="keyspaces">Keyspaces</TabsTrigger>
                  <TabsTrigger value="details">Detailed Stats</TabsTrigger>
                </TabsList>
                <TabsContent value="distribution" className="mt-6">
                  <MemoryDistributionByDataType result={result!} />
                </TabsContent>
                <TabsContent value="keyspaces" className="mt-6">
                  <KeyspaceStatistics result={result!} />
                </TabsContent>
                <TabsContent value="details" className="mt-6">
                  <DetailedMemoryStatistics result={result!} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </>}
      </Card>
    </div>
  )
}
