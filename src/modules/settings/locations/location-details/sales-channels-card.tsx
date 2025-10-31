"use client"

import { HelpCircle, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SalesChannelsCard() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">Sales Channels</h2>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center py-8">
        <HelpCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-4">No records</p>
        <p className="text-xs text-muted-foreground mb-6">The location is not connected to any sales channels.</p>
        <Button variant="outline" size="sm">
          Connect sales channels
        </Button>
      </div>
    </Card>
  )
}
