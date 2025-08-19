"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const data = [
  {
    id: 1,
    user: {
      name: "Alex Johnson",
      email: "alex@example.com",
      image: "/placeholder-user.jpg",
    },
    ip: "192.168.1.1",
    timestamp: "2023-04-14 14:32:45",
    location: "New York, USA",
  },
  {
    id: 2,
    user: {
      name: "Sarah Miller",
      email: "sarah@example.com",
      image: "/placeholder-user.jpg",
    },
    ip: "192.168.1.2",
    timestamp: "2023-04-14 13:21:33",
    location: "London, UK",
  },
  {
    id: 3,
    user: {
      name: "Michael Brown",
      email: "michael@example.com",
      image: "/placeholder-user.jpg",
    },
    ip: "192.168.1.3",
    timestamp: "2023-04-14 12:15:22",
    location: "Toronto, Canada",
  },
  {
    id: 4,
    user: {
      name: "Emily Davis",
      email: "emily@example.com",
      image: "/placeholder-user.jpg",
    },
    ip: "192.168.1.4",
    timestamp: "2023-04-14 11:05:17",
    location: "Sydney, Australia",
  },
  {
    id: 5,
    user: {
      name: "David Wilson",
      email: "david@example.com",
      image: "/placeholder-user.jpg",
    },
    ip: "192.168.1.5",
    timestamp: "2023-04-14 10:47:09",
    location: "Berlin, Germany",
  },
  {
    id: 6,
    user: null,
    ip: "192.168.1.6",
    timestamp: "2023-04-14 09:32:51",
    location: "Paris, France",
  },
  {
    id: 7,
    user: null,
    ip: "192.168.1.7",
    timestamp: "2023-04-14 08:21:44",
    location: "Tokyo, Japan",
  },
]

export function PostDownloadDetails() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>IP Address</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              {item.user ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={item.user.image || "/placeholder.svg"} alt={item.user.name} />
                    <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{item.user.name}</div>
                    <div className="text-xs text-muted-foreground">{item.user.email}</div>
                  </div>
                </div>
              ) : (
                <Badge variant="outline">Anonymous</Badge>
              )}
            </TableCell>
            <TableCell>{item.ip}</TableCell>
            <TableCell>{item.location}</TableCell>
            <TableCell>{item.timestamp}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
