"use client";
import React, { memo, useMemo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import { TimeAgo } from "@/lib/timeAgo";
import Shadcn_table from "@/components/table/table";
import SubHeader from "../layout/header/sub-header";
import useWindowWidth from "@/hooks/useWindowWidth";
import ShadcnPagination from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { useGetAllpostEventTrackingDetailsQuery } from "@/state/post-event-tracking-api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { platformColors } from "@/services/helpers";

interface EventTrackingListProps {
    type: string;
}
const EventTrackingList = ({ type }: EventTrackingListProps) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<string>("10");

    //---------- all hookes
    const { data, isLoading } = useGetAllpostEventTrackingDetailsQuery({
        rowsPerPage: Number(rowsPerPage),
        page: currentPage,
        type: type
    });


    const width = useWindowWidth();
    const result = data?.result || [];
    const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
        "platform","type"
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
                <TableCell className="font-medium">
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
                <TableCell> <Badge
                    className={
                        platformColors[item.platform as keyof typeof platformColors]
                    }
                >
                    {item.platform}
                </Badge></TableCell>
                <TableCell>{<TimeAgo time={item.updatedAt} />}</TableCell>
                <TableCell>{item.ip.ip}</TableCell>
                <TableCell>
                    {item?.ip?.geoLocation?.country},{item?.ip?.geoLocation?.region},
                    {item?.ip?.geoLocation?.city}
                </TableCell>
                <TableCell>
                    <TimeAgo time={item?.createdAt || ""} />
                </TableCell>
            </TableRow>
        ));
    }, [filteredItems]);

    return (
        <>
            <SubHeader
                searchTerm={searchTerm}
                placeHolder={"Search by platform, type"}
                setSearchTerm={setSearchTerm}
                setRowsPerPage={setRowsPerPage}
                dataCounter={data?.dataCounter}
            />
            <div
                style={{ width: width < 749 ? `${width}px` : "100%" }}
                className={`min-h-[400px] px-2 lg:px-6 overflow-hidden`}
            >
                <Shadcn_table
                    table_header={["Userby ip", "Platform", "IP Address", "Location", "Timestamp"]}
                    tabel_body={() => tableBody}
                    isLoading={isLoading}
                />
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
        </>
    );
};

export default memo(EventTrackingList);
