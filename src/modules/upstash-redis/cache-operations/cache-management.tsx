"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstanceSelector } from "../dashboard/instance-selector"
import SearchKeys from "./search-keys"
import DeleteKeys from "./delete-keys"

export function CacheManagement() {


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cache Management</CardTitle>
          <CardDescription>Search, view, and delete cache entries from your Redis instance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <InstanceSelector />
          </div>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search Keys</TabsTrigger>
              <TabsTrigger value="delete">Delete Keys</TabsTrigger>
            </TabsList>
            <TabsContent value="search" className="mt-6 space-y-6">
              <SearchKeys />
            </TabsContent>
            <TabsContent value="delete" className="mt-6 space-y-6">
              <DeleteKeys />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
