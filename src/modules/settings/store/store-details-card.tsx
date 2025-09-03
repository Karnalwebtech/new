import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const rows: { label: string; value: React.ReactNode }[] = [
  { label: "Name", value: "Medusa Store" },
  {
    label: "Default currency",
    value: (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="uppercase">
          INR
        </Badge>
        <span>Indian Rupee</span>
      </div>
    ),
  },
  {
    label: "Default region",
    value: <Badge variant="secondary">India</Badge>,
  },
  {
    label: "Default sales channel",
    value: <Badge variant="secondary">Default Sales Channel</Badge>,
  },
  {
    label: "Default location",
    value: <Badge variant="secondary">Indian Warehouse</Badge>,
  },
]

export function StoreDetailsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Store</CardTitle>
        <CardDescription>Manage your store&apos;s details</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div role="table" className="border-t">
          {rows.map((r, i) => (
            <div role="row" key={r.label} className="grid grid-cols-12 items-center border-b">
              <div className="col-span-12 md:col-span-3 px-6 py-4 text-sm text-muted-foreground">{r.label}</div>
              <div className="col-span-12 md:col-span-9 px-6 py-4">{r.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
