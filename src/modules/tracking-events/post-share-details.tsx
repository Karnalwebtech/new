"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePostEventTrackingDetailsQuery } from "@/state/post-event-tracking-api";
import { TimeAgo } from "@/lib/timeAgo";
import { platformColors } from "@/services/helpers";


interface PostShareDetails {
  type:string
}
export function PostShareDetails({type}:PostShareDetails) {
  const { data } = usePostEventTrackingDetailsQuery({
    rowsPerPage: 10,
    page: 1,
    type: type,
  });
  const result = data?.result || [];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Platform</TableHead>
          <TableHead>IP Address</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.map((item) => (
          <TableRow key={item._id}>
            <TableCell>
              {item.ip ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                      <AvatarImage src={"/assets/avatar.webp"} alt={item.ip?.ip} />
                              <AvatarFallback>{item.ip.ip.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{item.ip.ip}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.ip.os}
                    </div>
                  </div>
                </div>
              ) : (
                <Badge variant="outline">Anonymous</Badge>
              )}
            </TableCell>
            <TableCell>
              <Badge
                className={
                  platformColors[item.platform as keyof typeof platformColors]
                }
              >
                {item.platform}
              </Badge>
            </TableCell>
            <TableCell>{item.ip.ip}</TableCell>
            <TableCell>
              {item?.ip?.geoLocation?.country},{item?.ip?.geoLocation?.region},
              {item?.ip?.geoLocation?.city}
            </TableCell>
            <TableCell>
              <TimeAgo time={item?.createdAt || ""} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
