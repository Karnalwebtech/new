"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function InstanceSelector() {
  const [selectedInstance, setSelectedInstance] = useState("Karnalwebtech")

  // Sample instances
  const instances = [
    { id: "Karnalwebtech", name: "Karnal web tech" },
  ]

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Select Instance:</span>
        <Select value={selectedInstance} onValueChange={setSelectedInstance}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select an instance" />
          </SelectTrigger>
          <SelectContent>
            {instances.map((instance) => (
              <SelectItem key={instance.id} value={instance.id}>
                {instance.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
