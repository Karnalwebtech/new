"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"

interface IPStatusBadgeProps {
  ipAddress: string
  lastUsedAt: Date
  isActive: boolean
  userAgent: string
}

export default function IPStatusBadgeProps({ ipAddress, lastUsedAt, isActive, userAgent }: IPStatusBadgeProps) {
  const [isCurrent, setIsCurrent] = useState(false)

  useEffect(() => {
    // Function to check if this IP log entry matches the current session
    const checkIfCurrent = async () => {
      try {
        // Option 1: Compare with client-side information
        const currentUserAgent = navigator.userAgent

        // Option 2: Or fetch the current IP from an API endpoint you create
        // const response = await fetch('/api/current-session');
        // const data = await response.json();
        // const currentIp = data.ipAddress;

        // Determine if current based on:
        // 1. Matching user agent
        // 2. Active status
        // 3. Recent timestamp (within last hour)
        const isRecentTimestamp = new Date().getTime() - new Date(lastUsedAt).getTime() < 3600000

        // This is a simplified check - in production you'd use more reliable methods
        setIsCurrent(isActive && isRecentTimestamp && currentUserAgent === userAgent)
      } catch (error) {
        console.error("Error determining current session:", error)
        setIsCurrent(false)
      }
    }

    checkIfCurrent()
  }, [ipAddress, lastUsedAt, isActive, userAgent])

  return isCurrent ? (
    <Badge className="bg-green-100 text-green-700">Current</Badge>
  ) : (
    <Badge variant="outline">Previous</Badge>
  )
}

