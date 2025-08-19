"use client";
import {
  Activity,
  Clock,
  FileText,
  Trash2,
  UserPlus,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ParaSkeleton } from "@/components/skeletons/para-skeleton";
import { AuditLog } from "@/types/audit-user-type";
import { formatDate } from "@/services/helpers";
interface RecentActivityPropd {
  isLoading: boolean;
  result: AuditLog[];
}
export function RecentActivity({
  isLoading = false,
  result,
}: RecentActivityPropd) {

  // Function to determine the icon based on action type
  const getIcon = (actionType: string) => {
    switch (actionType) {
      case "LOGIN":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "CREATE":
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case "UPDATE":
        return <Edit className="h-4 w-4 text-yellow-500" />;
      case "DELETE":
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case "UPLOAD":
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your recent account activity and events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <ParaSkeleton key={i} style="h-8 w-full" />
              ))
            : result?.map((activity, i) => (
                <div key={i} className="flex items-start">
                  <div className="mr-4 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {getIcon(activity.actionType)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity?.details?.description}
                    </p>
                    <p className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatDate(activity?.createdAt, "long", true)}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
      
    </Card>
  );
}
