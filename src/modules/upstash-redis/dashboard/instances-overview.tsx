"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import RedisInstances from "../redis-instances"

export function InstancesOverview() {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Redis Instances</CardTitle>
          <CardDescription>Manage and monitor your Upstash Redis instances.</CardDescription>
        </div>
        <Link href="/dashboard/instances/new" className="ml-auto">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Instance
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <RedisInstances isHeaderVisiable={false} />
      </CardContent>
    </Card>
  )
}
