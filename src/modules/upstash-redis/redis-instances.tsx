"use client";
import React, { memo, useMemo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import Shadcn_table from "@/components/table/table";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import useWindowWidth from "@/hooks/useWindowWidth";
import ShadcnPagination from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import SubHeader from "../layout/header/sub-header";
import { useGetUpstashRedisListQuery } from "@/state/upstash-redis-api";
import { formatDate, formatOperationsPerDay } from "@/services/helpers";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
interface RedisInstancesProps {
    isHeaderVisiable?: boolean;
}
const RedisInstances = ({ isHeaderVisiable = true }: RedisInstancesProps) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<string>("10");
    //   const [removeId, setRemoveId] = useState<string>("");

    //---------- all hookes
    const { data, error, isLoading } = useGetUpstashRedisListQuery({
        rowsPerPage: Number(rowsPerPage),
        page: currentPage,
    });
    //   const [
    //     deletePost,
    //     { error: deleteError, isLoading: deleteLoading, isSuccess },
    //   ] = useDeletePostMutation();
    useHandleNotifications({
        error: error,
        // isSuccess,
        // successMessage: "Post deleted successfully!",
    });
    const width = useWindowWidth();
    const result = data?.result || [];
    const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
        "database_name", "region"
    ]);
    //   const removeHandler = useCallback(
    //     async (remove_id: string) => {
    //       setRemoveId(remove_id);
    //       await deletePost({ id: remove_id });
    //     },
    //     [deletePost]
    //   );
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
                <TableCell className="font-medium">{item.database_name}</TableCell>
                <TableCell className="font-medium">{item.region}</TableCell>
                <TableCell>
                    <Badge variant={item.state === "active" ? "default" : "outline"}>{item.state}</Badge>
                </TableCell>
                <TableCell className="font-medium">{item.db_disk_threshold / item.db_memory_threshold}%</TableCell>
                <TableCell className="font-medium">{item.db_max_clients}</TableCell>
                <TableCell className="font-medium">{formatOperationsPerDay(item.db_max_commands_per_second)}</TableCell>
                <TableCell className="font-medium">{formatDate(new Date(item.creation_time * 1000).toUTCString())}</TableCell>
                <TableCell>
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
                            <DropdownMenuItem>View metrics</DropdownMenuItem>
                            <DropdownMenuItem>Browse data</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Edit settings</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete instance</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
        ));
    }, [filteredItems]);

    return (
        <>
            {isHeaderVisiable && <SubHeader
                searchTerm={searchTerm}
                placeHolder={"Search by Name, Region"}
                setSearchTerm={setSearchTerm}
                setRowsPerPage={setRowsPerPage}
                dataCounter={data?.result?.length}
            />}
            <div
                style={{ width: width < 749 ? `${width}px` : "100%" }}
                className={`min-h-[400px] px-2 lg:px-6 overflow-hidden`}
            >
                <Shadcn_table
                    table_header={["Name", "Region", "Status", "Memory", "Connections", "Operations", "Create at", "Action"]}
                    tabel_body={() => tableBody}
                    isLoading={isLoading}
                />
                <div className="flex-1 text-sm text-muted-foreground">
                    {/* {data && data?.dataCounter > Number(rowsPerPage) && ( */}
                    <ShadcnPagination
                        currentPage={currentPage}
                        totalPages={Number(rowsPerPage)}
                        setCurrentPage={setCurrentPage}
                        data_length={0}
                    />
                    {/* )} */}
                </div>
            </div>
        </>
    );
};

export default memo(RedisInstances);
