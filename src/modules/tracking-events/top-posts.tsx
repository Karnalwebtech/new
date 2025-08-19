"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrackingEvent } from "@/types/post-event-tracking-type"

interface TopPostsProps {
  result: TrackingEvent[]
}
export function TopPosts({ result }: TopPostsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Post Title</TableHead>
          <TableHead className="text-right">Downloads</TableHead>
          <TableHead className="text-right">Shares</TableHead>
          <TableHead className="text-right">Engagement</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.map((post) => (
          <TableRow key={post._id}>
            <TableCell className="font-medium">
              <span className="line-clamp-2">
                {post?.post_id?.title}
              </span>
            </TableCell>
            <TableCell className="text-right">{post.download}</TableCell>
            <TableCell className="text-right">{post.share}</TableCell>
            {/* <TableCell className="text-right">
              <Badge
                variant={
                  post.engagement === "High" ? "default" : post.engagement === "Medium" ? "outline" : "secondary"
                }
              >
                {post.engagement}
              </Badge>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
