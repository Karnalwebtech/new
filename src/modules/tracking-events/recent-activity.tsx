"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackingEventDetails } from "@/types/post-event-tracking-type";
import { TimeAgo } from "@/lib/timeAgo";

interface RecentActivityProps {
  result: TrackingEventDetails[];
}
export function RecentActivity({ result }: RecentActivityProps) {
  return (
    <div className="space-y-8">
      {result.map((item) => (
        <div className="flex items-center" key={item._id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={"/assets/avatar.webp"} alt={item.ip?.ip} />
            <AvatarFallback>{item.ip?.ip.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex gap-4">
            <div className="ml-4 space-y-1 w-[70%]">
              <p className="text-sm font-medium leading-none">
                {item.ip?.ip}
                <span className="text-muted-foreground pl-2">
                  {item.type === "download"
                    ? "downloaded"
                    : `shared on ${item.platform}`}
                </span>
              </p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {item.post_id?.title}
              </p>
            </div>
            <div className="ml-auto w-[30%] font-medium text-xs text-muted-foreground flex items-center gap-1">
              {item.type === "download" ? (
                <Download className={cn("h-3 w-3")} />
              ) : (
                <Share className={cn("h-3 w-3")} />
              )}
              <TimeAgo time={item.createdAt || ""} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
