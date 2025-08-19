"use client";

import { memo, useState } from "react";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Referral, ReferredUsers } from "@/types/referral-type";
import { formatDate } from "@/services/helpers";
import { formatCurrency } from "@/services/currency";
import TableLoaderSkeleton from "@/components/skeletons/table-loader-skeleton";
import Link from "next/link";
interface ReferredUsersTableProps {
  data: Referral | undefined;
  isLoading: boolean;
}
function ReferredUsersTable({ data, isLoading }: ReferredUsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers: ReferredUsers[] | undefined =
    data &&
    data?.referralHierarchy.filter(
      (user) =>
        user?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Referred Users</CardTitle>
            <CardDescription>
              List of users you&apos;ve referred
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full pl-8 sm:w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <div
          className="w-full grid gap-6 md:grid-cols-2 overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Reward</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableLoaderSkeleton
                  length={10}
                  content={["name", "status", "date", "reward"]}
                  Parenttag={TableRow}
                  Subtag={TableCell}
                />
              ) : (
                filteredUsers?.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="font-medium">{user?.user?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user?.user?.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user?.referralStatus === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {user?.referralStatus === "active"
                          ? "Converted"
                          : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(user?.user?.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(user?.rewardAmount || 0)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pb-2">
        <Link href={"/dashboard/referral/referrals"} className="text-blue-900">
          View more
        </Link>
      </CardFooter>
    </Card>
  );
}

ReferredUsersTable.displayName = "ReferredUsersTable";

export default memo(ReferredUsersTable);
