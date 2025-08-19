import React, { memo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { useTheme } from "next-themes"
import { UpstashRedisDatabaseDetails } from '@/types/upstash-redis-type'

interface KeyspaceStatisticsProps {
  result: UpstashRedisDatabaseDetails;
}

const KeyspaceStatistics = ({ result }: KeyspaceStatisticsProps) => {
  const { theme } = useTheme()

  if (!result?.keyspace_statistics || result.keyspace_statistics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Keyspace Statistics</CardTitle>
          <CardDescription>No keyspace data available.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Keyspace Statistics</CardTitle>
        <CardDescription>Keys and expiry statistics by database</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={result.keyspace_statistics}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#333" : "#eee"} />
              <XAxis dataKey="database" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                  borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                }}
              />
              <Legend />
              <Bar dataKey="total_keys" name="Total Keys" fill="#3b82f6" />
              <Bar dataKey="keys_with_ttl" name="Keys with TTL" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {result.keyspace_statistics.map((db) => (
            <Card key={db.database}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{db.database}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Keys:</span>
                    <span className="font-medium">{db.total_keys.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Keys with TTL:</span>
                    <span className="font-medium">{db.keys_with_ttl.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg TTL:</span>
                    <span className="font-medium">{db.avg_ttl}s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default memo(KeyspaceStatistics)
