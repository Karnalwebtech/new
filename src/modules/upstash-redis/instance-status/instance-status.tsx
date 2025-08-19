"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Play, Pause } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InstanceStatusDbCard from "./instance-status-db-card"
import { useGetUpstashRedisListQuery } from "@/state/upstash-redis-api"
import Loader from "@/components/loader"
import { formatsampleFileSize } from "@/services/helpers"

export function InstanceStatus() {

  const { data,isLoading } = useGetUpstashRedisListQuery({
    rowsPerPage: 300,
    page: 1,
  });
  const result = data?.result || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "warning":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Warning
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Maintenance
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            Inactive
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMemoryColor = (percentage: number) => {
    if (percentage < 70) return "bg-green-500"
    if (percentage < 90) return "bg-yellow-500"
    return "bg-red-500"
  }

  // const handleInstanceSelect = (instanceId: string) => {
  //   const instance = instances.find((inst) => inst.id === instanceId)
  //   if (instance) {
  //     setresult[0](instance)
  //   }
  // }

  // const handleInstanceAction = () => {
  //   // setIsLoading(true)
  // }


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
                <CardTitle>Instance Status</CardTitle>
                <CardDescription>Monitor and manage the status of your Redis instances</CardDescription>
              </div>
              <Button variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-6 text-sm text-muted-foreground">Last updated: {result[0]?.creation_time}</div>

              <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <InstanceStatusDbCard result={result} />

              </div>

              {result[0] && (
                <div className="space-y-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{result[0].database_name}</h3>
                      <p className="text-sm text-muted-foreground">{result[0].endpoint}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result[0].state !== "active" && (
                        <Button
                          size="sm"
                          // onClick={() => handleInstanceAction("resume", result[0].database_id)}
                          disabled={isLoading}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Resume
                        </Button>
                      )}
                      {result[0].state === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          // onClick={() => handleInstanceAction("pause", result[0].database_id)}
                          disabled={isLoading}
                        >
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        // onClick={() => handleInstanceAction("restart", result[0].database_id)}
                        disabled={isLoading}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Restart
                      </Button>
                    </div>
                  </div>
                  {/* 
              {result[0].alerts.length > 0 && (
                <div className="space-y-2">
                  {result[0].alerts.map((alert, index) => (
                    <Alert
                      key={index}
                      variant={alert.type === "warning" ? "destructive" : "default"}
                      className={alert.type === "info" ? "border-blue-500" : ""}
                    >
                      {alert.type === "warning" ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      <AlertTitle>{alert.type === "warning" ? "Warning" : "Information"}</AlertTitle>
                      <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )} */}

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="configuration">Configuration</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                              <h3 className="font-semibold">Instance Details</h3>
                              <div className="space-y-2 rounded-md border p-4">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Status:</span>
                                  <span className="font-medium">{getStatusBadge(result[0].state)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Region:</span>
                                  <span className="font-medium">{result[0].primary_region}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Redis Version:</span>
                                  <span className="font-medium">v test</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Uptime:</span>
                                  <span className="font-medium">{result[0].creation_time}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Endpoint:</span>
                                  <span className="font-medium truncate max-w-[200px]">{result[0].endpoint}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="font-semibold">Memory & Connections</h3>
                              <div className="space-y-2 rounded-md border p-4">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Memory Usage:</span>
                                  <span className="font-medium">
                                    {formatsampleFileSize(result[0].db_memory_threshold)} MB / {formatsampleFileSize(result[0].db_disk_threshold)} MB
                                  </span>
                                </div>
                                <div className="mb-2">
                                  <Progress
                                    value={(result[0].db_memory_threshold / result[0].db_disk_threshold) * 100}
                                    className={`h-2 ${getMemoryColor((result[0].db_memory_threshold / result[0].db_disk_threshold) * 100)}`}
                                  />
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Connected Clients:</span>
                                  <span className="font-medium">{result[0].db_max_clients}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Operations:</span>
                                  <span className="font-medium">{result[0].db_max_commands_per_second}</span>
                                </div>
                              </div>

                              <h3 className="font-semibold">Replication</h3>
                              <div className="space-y-2 rounded-md border p-4">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Role:</span>
                                  <span className="font-medium capitalize">master</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Connected Replicas:</span>
                                  <span className="font-medium">2</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Replication Lag:</span>
                                  <span className="font-medium">0ms</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="performance" className="mt-6">
                      {/* <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Metrics</CardTitle>
                      <CardDescription>Operations per second and latency over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={result[0].performance}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#eee"} />
                            <XAxis dataKey="time" stroke={theme === "dark" ? "#888" : "#888"} />
                            <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                            <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                                borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                              }}
                            />
                            <Line yAxisId="left" type="monotone" dataKey="ops" stroke="#3b82f6" name="Operations/sec" />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="latency"
                              stroke="#10b981"
                              name="Latency (ms)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-sm font-medium">
                              <Server className="mr-2 h-4 w-4 text-muted-foreground" />
                              Peak Operations
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {Math.max(...result[0].performance.map((p) => p.ops))}/sec
                            </div>
                            <p className="text-xs text-muted-foreground">Highest recorded operations per second</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-sm font-medium">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              Average Latency
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {(
                                result[0].performance.reduce((acc, curr) => acc + curr.latency, 0) /
                                result[0].performance.length
                              ).toFixed(1)}
                              ms
                            </div>
                            <p className="text-xs text-muted-foreground">Average response time for operations</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-sm font-medium">
                              <AlertTriangle className="mr-2 h-4 w-4 text-muted-foreground" />
                              Performance Status
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center text-2xl font-bold">
                              {result[0].status === "active" ? (
                                <>
                                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                                  Good
                                </>
                              ) : result[0].status === "warning" ? (
                                <>
                                  <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                                  Warning
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="mr-2 h-5 w-5 text-blue-500" />
                                  Maintenance
                                </>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">Current performance health status</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card> */}
                    </TabsContent>

                    <TabsContent value="configuration" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Instance Configuration</CardTitle>
                          <CardDescription>View and modify Redis instance configuration</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="rounded-md border p-4">
                              <h3 className="mb-4 font-semibold">Memory Settings</h3>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Max Memory:</span>
                                    <span className="font-medium">{result[0].db_disk_threshold} MB</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Memory Policy:</span>
                                    <span className="font-medium">volatile-lru</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Memory Samples:</span>
                                    <span className="font-medium">5</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Memory Fragmentation Ratio:</span>
                                    <span className="font-medium">1.08</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-md border p-4">
                              <h3 className="mb-4 font-semibold">Network Settings</h3>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Max Connections:</span>
                                    <span className="font-medium">10,000</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Timeout:</span>
                                    <span className="font-medium">300 seconds</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">TCP Keepalive:</span>
                                    <span className="font-medium">300 seconds</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">TLS:</span>
                                    <span className="font-medium">Enabled</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-md border p-4">
                              <h3 className="mb-4 font-semibold">Persistence Settings</h3>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Persistence:</span>
                                    <span className="font-medium">Enabled</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">RDB Persistence:</span>
                                    <span className="font-medium">Every 60 minutes</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">AOF Persistence:</span>
                                    <span className="font-medium">Enabled</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">AOF Rewrite Percentage:</span>
                                    <span className="font-medium">100%</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button variant="outline" className="mr-2">
                                Reset to Defaults
                              </Button>
                              <Button>Save Configuration</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </>}
      </Card>
    </div>
  )
}
