"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, UserPlus, X } from "lucide-react"

// Mock shared users data
const sharedUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    accessType: "read",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah@example.com",
    accessType: "write",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    accessType: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function AccessControl() {
  const [isPrivate, setIsPrivate] = useState(true)
  const [users, setUsers] = useState(sharedUsers)
  const [searchQuery, setSearchQuery] = useState("")

  const handleAccessChange = (userId: number, newAccess: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, accessType: newAccess } : user)))
  }

  const handleRemoveUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Access Control</CardTitle>
          <CardDescription>Manage who can access your storage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="private-mode" className="flex flex-col space-y-1">
              <span>Private Storage</span>
              <span className="text-xs text-muted-foreground">
                When enabled, only you and people you share with can access
              </span>
            </Label>
            <Switch id="private-mode" checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          <div className="pt-4">
            <h3 className="mb-4 text-sm font-medium">Storage Visibility</h3>
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">{isPrivate ? "Private Storage" : "Public Storage"}</div>
                  <div className="text-xs text-muted-foreground">
                    {isPrivate ? "Only you and people you share with can access" : "Anyone with the link can access"}
                  </div>
                </div>
                <Badge variant={isPrivate ? "outline" : "default"}>{isPrivate ? "Private" : "Public"}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shared With</CardTitle>
          <CardDescription>People with access to your storage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </div>

          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      defaultValue={user.accessType}
                      onValueChange={(value) => handleAccessChange(user.id, value)}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Select access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="write">Write</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-muted-foreground">No users found</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

