"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Referral } from "@/types/referral-type"
import { memo, useMemo } from "react"


interface ReferralChartsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  prevData: Referral[] | undefined;
}
function ReferralCharts({ activeTab, setActiveTab, prevData }: ReferralChartsProps) {
  // Ensure prevData is always an array
  const safePrevData = useMemo(() => {
    return Array.isArray(prevData) ? prevData : []
  }, [prevData])

  // Get the current date and reset time to midnight
  const today = useMemo(() => {
    const now = new Date()
    const todayDate = new Date(now)
    todayDate.setHours(0, 0, 0, 0)
    return todayDate
  }, [])

  // Generate date ranges based on active tab
  const dateRanges = useMemo(() => {
    if (activeTab === "weekly") {
      // Last 7 days
      return [...Array(7)]
        .map((_, i) => {
          const date = new Date(today)
          date.setDate(today.getDate() - i)
          return date
        })
        .reverse()
    } else if (activeTab === "monthly") {
      // Last 4 weeks
      return [...Array(4)]
        .map((_, i) => {
          const date = new Date(today)
          date.setDate(today.getDate() - i * 7)
          return date
        })
        .reverse()
    } else {
      // Last 12 months
      return [...Array(12)]
        .map((_, i) => {
          const date = new Date(today)
          date.setMonth(today.getMonth() - i)
          return date
        })
        .reverse()
    }
  }, [activeTab, today])

  // Format labels based on active tab
  const formatLabel = (date: Date) => {
    if (activeTab === "weekly") {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    } else if (activeTab === "monthly") {
      return `W${Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)}`
    } else {
      return date.toLocaleDateString("en-US", { month: "short" })
    }
  }

  // Compute referral counts based on active tab
  const referralStats = useMemo(() => {
    if (!safePrevData.length) return { data: dateRanges.map(() => 0) }

    if (activeTab === "weekly") {
      // Daily counts for the last 7 days
      return {
        data: dateRanges.map((day) => {
          return safePrevData.filter((entry) => {
            const entryDate = new Date(entry.createdAt)
            return entryDate.toDateString() === day.toDateString()
          }).length
        }),
      }
    } else if (activeTab === "monthly") {
      // Weekly counts for the last 4 weeks
      return {
        data: dateRanges.map((weekStart) => {
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)

          return safePrevData.filter((entry) => {
            const entryDate = new Date(entry.createdAt)
            return entryDate >= weekStart && entryDate <= weekEnd
          }).length
        }),
      }
    } else {
      // Monthly counts for the last 12 months
      return {
        data: dateRanges.map((monthStart) => {
          const monthEnd = new Date(monthStart)
          monthEnd.setMonth(monthStart.getMonth() + 1)
          monthEnd.setDate(0) // Last day of the month

          return safePrevData.filter((entry) => {
            const entryDate = new Date(entry.createdAt)
            return (
              entryDate.getMonth() === monthStart.getMonth() && entryDate.getFullYear() === monthStart.getFullYear()
            )
          }).length
        }),
      }
    }
  }, [safePrevData, dateRanges, activeTab])

  // Compute reward amounts based on active tab
  const referralRewards = useMemo(() => {
    if (!safePrevData.length) return { data: dateRanges.map(() => 0) }

    if (activeTab === "weekly") {
      // Daily rewards for the last 7 days
      return {
        data: dateRanges.map((day) => {
          return safePrevData
            .filter((entry) => {
              const entryDate = new Date(entry.createdAt)
              return entryDate.toDateString() === day.toDateString()
            })
            .reduce(
              (sum, entry) =>
                sum +
                (typeof entry.rewardAmount === "string"
                  ? Number.parseFloat(entry.rewardAmount) || 0
                  : entry.rewardAmount || 0),
              0,
            )
        }),
      }
    } else if (activeTab === "monthly") {
      // Weekly rewards for the last 4 weeks
      return {
        data: dateRanges.map((weekStart) => {
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)

          return safePrevData
            .filter((entry) => {
              const entryDate = new Date(entry.createdAt)
              return entryDate >= weekStart && entryDate <= weekEnd
            })
            .reduce(
              (sum, entry) =>
                sum +
                (typeof entry.rewardAmount === "string"
                  ? Number.parseFloat(entry.rewardAmount) || 0
                  : entry.rewardAmount || 0),
              0,
            )
        }),
      }
    } else {
      // Monthly rewards for the last 12 months
      return {
        data: dateRanges.map((monthStart) => {
          return safePrevData
            .filter((entry) => {
              const entryDate = new Date(entry.createdAt)
              return (
                entryDate.getMonth() === monthStart.getMonth() && entryDate.getFullYear() === monthStart.getFullYear()
              )
            })
            .reduce(
              (sum, entry) =>
                sum +
                (typeof entry.rewardAmount === "string"
                  ? Number.parseFloat(entry.rewardAmount) || 0
                  : entry.rewardAmount || 0),
              0,
            )
        }),
      }
    }
  }, [safePrevData, dateRanges, activeTab])

  // Calculate max values for proper scaling
  const maxReferralCount = Math.max(1, ...referralStats.data)
  const maxRewardAmount = Math.max(1, ...referralRewards.data)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Referral Activity</CardTitle>
          <CardDescription className="text-[12px]">
            {activeTab === "weekly"
              ? "Number of referrals over the last 7 days"
              : activeTab === "monthly"
                ? "Number of referrals over the last 4 weeks"
                : "Number of referrals over the last 12 months"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] p-2 w-full">
            <div className="flex h-full items-end gap-2">
              {referralStats.data.map((value, index) => {
                const heightPercentage = (value / maxReferralCount) * 100

                return (
                  <div
                    key={index}
                    className="relative flex-1 rounded-t bg-primary transition-all duration-300 ease-in-out"
                    style={{
                      height: `${heightPercentage}%`,
                      minHeight: value > 0 ? "4px" : "2px",
                    }}
                  >
                    <div className="absolute -top-6 w-full text-center text-xs font-medium">{value}</div>
                  </div>
                )
              })}
            </div>
            <div className="mt-[2px] flex justify-between text-xs text-muted-foreground">
              {dateRanges.map((date, i) => (
                <div key={i} className="text-center">
                  {formatLabel(date)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Rewards Earned</CardTitle>
              <CardDescription className="text-[12px]">
                {activeTab === "weekly"
                  ? "Total rewards earned over the last 7 days"
                  : activeTab === "monthly"
                    ? "Total rewards earned over the last 4 weeks"
                    : "Total rewards earned over the last 12 months"}
              </CardDescription>
            </div>
            <Tabs value={activeTab} className="w-full sm:w-[200px]" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="weekly">Week</TabsTrigger>
                <TabsTrigger value="monthly">Month</TabsTrigger>
                <TabsTrigger value="yearly">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[220px] p-2 w-full">
            <div className="flex h-full items-end gap-2">
              {referralRewards.data.map((value, index) => {
                const heightPercentage = (value / maxRewardAmount) * 100

                return (
                  <div
                    key={index}
                    className="relative flex-1 rounded-t bg-green-500 transition-all duration-300 ease-in-out"
                    style={{
                      height: `${heightPercentage}%`,
                      minHeight: value > 0 ? "4px" : "2px",
                    }}
                  >
                    <div className="absolute -top-6 w-full text-center text-xs font-medium">{value}</div>
                  </div>
                )
              })}
            </div>
            <div className="mt-[2px] flex justify-between text-xs text-muted-foreground">
              {dateRanges.map((date, i) => (
                <div key={i} className="text-center">
                  {formatLabel(date)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}


ReferralCharts.displayName = "ReferralCharts";

export default memo(ReferralCharts);