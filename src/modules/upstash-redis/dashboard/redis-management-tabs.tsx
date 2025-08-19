"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataManagementForm } from "./data-management-form"
import { CacheManagement } from "../cache-operations/cache-management"
import { MemoryMonitor } from "../memory-monitor/memory-monitor"
import { InstanceStatus } from "../instance-status/instance-status"
import { BulkOperations } from "./bulk-operations"

export function RedisManagementTabs() {
  return (
    <Tabs defaultValue="data" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="data">Data Management</TabsTrigger>
        <TabsTrigger value="cache">Cache Operations</TabsTrigger>
        <TabsTrigger value="memory">Memory Usage</TabsTrigger>
        <TabsTrigger value="instances">Instance Status</TabsTrigger>
        <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
      </TabsList>

      <TabsContent value="data" className="mt-6">
        <DataManagementForm />
      </TabsContent>

      <TabsContent value="cache" className="mt-6">
        <CacheManagement />
      </TabsContent>

      <TabsContent value="memory" className="mt-6">
        <MemoryMonitor />
      </TabsContent>

      <TabsContent value="instances" className="mt-6">
        <InstanceStatus />
      </TabsContent>

      <TabsContent value="bulk" className="mt-6">
        <BulkOperations />
      </TabsContent>
    </Tabs>
  )
}
