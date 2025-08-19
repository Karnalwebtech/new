"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  Download,
  File,
  FileText,
  Filter,
  FolderPlus,
  Image,
  MoreVertical,
  Music,
  Search,
  Share2,
  Trash,
  Upload,
  Video,
} from "lucide-react"

// Mock file data
const files = [
  { id: 1, name: "Project Proposal.docx", type: "document", size: "2.5 MB", modified: "2023-12-05", shared: true },
  { id: 2, name: "Financial Report.xlsx", type: "spreadsheet", size: "4.2 MB", modified: "2023-12-03", shared: false },
  { id: 3, name: "Presentation.pptx", type: "presentation", size: "8.7 MB", modified: "2023-12-01", shared: true },
  { id: 4, name: "Profile Picture.jpg", type: "image", size: "1.8 MB", modified: "2023-11-28", shared: false },
  { id: 5, name: "Meeting Recording.mp4", type: "video", size: "45.3 MB", modified: "2023-11-25", shared: false },
  { id: 6, name: "Audio Notes.mp3", type: "audio", size: "12.1 MB", modified: "2023-11-22", shared: true },
]

export function FileManager() {
  const [searchQuery, setSearchQuery] = useState("")

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
      case "spreadsheet":
      case "presentation":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "image":
        return <Image className="h-4 w-4 text-green-500" />
      case "video":
        return <Video className="h-4 w-4 text-red-500" />
      case "audio":
        return <Music className="h-4 w-4 text-purple-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>My Files</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            <Button size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search files..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  Sort by
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Name</DropdownMenuItem>
                <DropdownMenuItem>Date Modified</DropdownMenuItem>
                <DropdownMenuItem>Size</DropdownMenuItem>
                <DropdownMenuItem>Type</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Modified</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.type)}
                          <span>{file.name}</span>
                          {file.shared && <Share2 className="h-3 w-3 text-muted-foreground" />}
                        </div>
                      </TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>{file.modified}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No files found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

