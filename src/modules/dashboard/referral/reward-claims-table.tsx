"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { memo } from "react";
import { Reward } from "@/types/reward-type";
import { formatDate } from "@/services/helpers";
import { formatCurrency } from "@/services/currency";
import TableLoaderSkeleton from "@/components/skeletons/table-loader-skeleton";
import Link from "next/link";
interface RewardClaimsTable {
  data: Reward[] | undefined;
  isLoading: boolean;
}
function RewardClaimsTable({ data, isLoading }: RewardClaimsTable) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Reward Claims</CardTitle>
        <CardDescription>History of your reward claims</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div
          className="w-full grid gap-6 md:grid-cols-2 overflow-hidden"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableLoaderSkeleton
                  length={10}
                  content={["Date", "Type", "Status", "Amount"]}
                  Parenttag={TableRow}
                  Subtag={TableCell}
                />
              ) : (
                data?.map((claim) => (
                  <TableRow key={claim._id}>
                    <TableCell>{formatDate(claim.claimedAt)}</TableCell>
                    <TableCell className="capitalize">
                      {claim.rewardType}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          claim.status === "paid" ? "default" : "outline"
                        }
                      >
                        {claim.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(claim.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pb-2">
        <Link href={"/dashboard/referral/rewards"} className="text-blue-900">
          View more
        </Link>
      </CardFooter>
    </Card>
  );
}

RewardClaimsTable.displayName = "RewardClaimsTable";

export default memo(RewardClaimsTable);
