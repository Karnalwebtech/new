"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGetAllRewardsQuery } from "@/state/reward-api";
import SubHeader from "@/modules/layout/header/sub-header";
import Shadcn_table from "@/components/table/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useMemo, useState } from "react";
import ShadcnPagination from "@/components/pagination";
import { formatDate } from "@/services/helpers";
import { formatCurrency } from "@/services/currency";
import useWindowWidth from "@/hooks/useWindowWidth";

export default function RewardsPage() {
  const width = useWindowWidth();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");
  const { data, isLoading } = useGetAllRewardsQuery({
    rowsPerPage: 10,
    page: 1,
  });

  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(
    data?.result || [],
    ["amount"]
  );

  const tableBody = useMemo(
    () =>
      filteredItems?.map((item, index) => {
        return (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}.</TableCell>
            <TableCell className="font-medium">
              <div>{item?.user?.name}</div>
            </TableCell>
            <TableCell className="font-medium">
              {formatDate(item?.claimedAt)}
            </TableCell>
            <TableCell className="font-medium">{item?.rewardType}</TableCell>
            <TableCell className="font-medium">
              <Badge variant={item.status === "paid" ? "default" : "outline"}>
                {item.status}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              {formatCurrency(item?.amount)}
            </TableCell>
          </TableRow>
        );
      }),
    [filteredItems]
  );

  const rewards = {
    "Total Rewards": data?.rewardsSummary?.totalRewards,
    "Pending Rewards": data?.rewardsSummary?.pendingRewards,
    "Paid Rewards": data?.rewardsSummary?.paidRewards,
    "Processing Rewards": data?.rewardsSummary?.processingRewards,
    "Declined Rewards": data?.rewardsSummary?.declinedRewards,
  };
  return (
    <>
      <div className="grid gap-6 grid-cols-2 lg:grid-cols-5 p-4">
        {Object.entries(rewards).map(([Key, value], i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {Key}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(value || 0)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SubHeader
        searchTerm={searchTerm}
        placeHolder={"Search by name, amount, date"}
        setSearchTerm={setSearchTerm}
        setRowsPerPage={setRowsPerPage}
        dataCounter={data?.dataCounter}
      />
      <div
        className="p-4 overflow-hidden"
        style={{ width: width < 749 ? `${width}px` : "100%" }}
      >
        <Shadcn_table
          table_header={["S.No", "Name", "Date", "Type", "Status", "Amount"]}
          tabel_body={() => tableBody}
          isLoading={isLoading}
        />
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {data && data?.dataCounter > Number(rowsPerPage) && (
              <ShadcnPagination
                currentPage={currentPage}
                totalPages={Number(rowsPerPage)}
                setCurrentPage={setCurrentPage}
                data_length={data?.dataCounter || 10}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
