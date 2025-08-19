"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

const data = [
  { date: "2023-04-01", downloads: 12, shares: 8 },
  { date: "2023-04-02", downloads: 18, shares: 12 },
  { date: "2023-04-03", downloads: 15, shares: 10 },
  { date: "2023-04-04", downloads: 25, shares: 15 },
  { date: "2023-04-05", downloads: 32, shares: 20 },
  { date: "2023-04-06", downloads: 28, shares: 18 },
  { date: "2023-04-07", downloads: 20, shares: 13 },
  { date: "2023-04-08", downloads: 22, shares: 15 },
  { date: "2023-04-09", downloads: 30, shares: 22 },
  { date: "2023-04-10", downloads: 35, shares: 25 },
  { date: "2023-04-11", downloads: 40, shares: 30 },
  { date: "2023-04-12", downloads: 38, shares: 28 },
  { date: "2023-04-13", downloads: 42, shares: 32 },
  { date: "2023-04-14", downloads: 35, shares: 24 },
]

export function PostActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="downloads" stroke="#adfa1d" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="shares" stroke="#f97316" />
      </LineChart>
    </ResponsiveContainer>
  )
}
