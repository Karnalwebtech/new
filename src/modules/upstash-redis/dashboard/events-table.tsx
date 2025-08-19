"use client"

import { useMemo, useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useGetUpstashRedisEventListsQuery } from "@/state/upstash-redis-api"
import Shadcn_table from "@/components/table/table"
import ShadcnPagination from "@/components/pagination"
import { useHandleNotifications } from "@/hooks/use-notification-handler"
import useWindowWidth from "@/hooks/useWindowWidth"
import { useTableFilters } from "@/hooks/useTableFilters"
import { formatDate } from "@/services/helpers"
import SubHeader from "@/modules/layout/header/sub-header"
interface EventsTableProps {
  isHeaderVisiable?: boolean;
}
export function EventsTable({ isHeaderVisiable = true }: EventsTableProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");

  //---------- all hookes
  const { data, error, isLoading } = useGetUpstashRedisEventListsQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  })

  useHandleNotifications({
    error: error,
  });
  const width = useWindowWidth();
  const result = data?.result || [];
  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
    "type", "key", "status"
  ]);

  const tableBody = useMemo(() => {
    if (!filteredItems || filteredItems.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center">
            No records found
          </TableCell>
        </TableRow>
      );
    }
    return filteredItems.map((item, index) => (
      <TableRow key={index}>
        <TableCell className="font-medium">{item.type}</TableCell>
        <TableCell className="font-medium">{item.key}</TableCell>
        <TableCell className="font-medium">{item.instance}</TableCell>
        <TableCell className="font-medium">{formatDate(item.timestamp)}</TableCell>
        <TableCell>
          <Badge
            variant={
              item.status === "success" ? "default" : item.status === "warning" ? "outline" : "destructive"
            }
          >
            {item.status}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Replay event</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [filteredItems]);


  return (
    <div className="space-y-4">
      {isHeaderVisiable && <SubHeader
        searchTerm={searchTerm}
        placeHolder={"Search by Type, Key, Status"}
        setSearchTerm={setSearchTerm}
        setRowsPerPage={setRowsPerPage}
        dataCounter={data?.dataCounter}
      />}
      <div
        style={{ width: width < 749 ? `${width}px` : "100%" }}
        className={`min-h-[400px] px-2 lg:px-6 overflow-hidden`}
      >
        <Shadcn_table
          table_header={["Type", "Key", "Instance", "Timestamp", "	Status", "Action"]}
          tabel_body={() => tableBody}
          isLoading={isLoading}
        />
        <div className="flex-1 text-sm text-muted-foreground">
          {data && data?.dataCounter > Number(rowsPerPage) && (
            <ShadcnPagination
              currentPage={currentPage}
              totalPages={Number(rowsPerPage)}
              setCurrentPage={setCurrentPage}
              data_length={data?.dataCounter}
            />
          )}
        </div>
      </div>
    </div>
  )
}
