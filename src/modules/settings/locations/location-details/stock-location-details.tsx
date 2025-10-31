"use client"

import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function StockLocationDetails() {
  return (
    <div className="space-y-6">
      {/* Location Info Card */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Pawan Kumar</h1>
            <p className="text-sm text-muted-foreground mt-1">
              GARIBDHAN ENTERPRISES, Shop no 3, Gali no 3 Vikas Nagar, Karnal Haryana 132001, India
            </p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Pickup Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">Pickup</h2>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground text-sm font-medium">
              Disabled
            </span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Shipping Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">Shipping</h2>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground text-sm font-medium">
              Disabled
            </span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* JSON Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-foreground">JSON</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">6 keys</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
