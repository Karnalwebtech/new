"use client";
import React, { memo, useMemo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import Shadcn_table from "@/components/table/table";
import SubHeader from "../layout/header/sub-header";
import useWindowWidth from "@/hooks/useWindowWidth";
import ShadcnPagination from "@/components/pagination";
import { useGetAllpostEventsTrackingQuery } from "@/state/post-event-tracking-api";

const PostEventList = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<string>("10");

    //---------- all hookes
    const { data, isLoading } = useGetAllpostEventsTrackingQuery({
        rowsPerPage: Number(rowsPerPage),
        page: currentPage,
    });


    const width = useWindowWidth();
    const result = data?.result || [];
    const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
        "download", "share"
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
              <span className="line-clamp-2">
                {item?.post_id?.title}
              </span>
            </TableCell>
            <TableCell className="text-right">{item.download}</TableCell>
            <TableCell className="text-right">{item.share}</TableCell>
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
        ));
    }, [filteredItems]);

    return (
        <>
            <SubHeader
                searchTerm={searchTerm}
                placeHolder={"Search by download, share"}
                setSearchTerm={setSearchTerm}
                setRowsPerPage={setRowsPerPage}
                dataCounter={data?.dataCounter}
            />
            <div
                style={{ width: width < 749 ? `${width}px` : "100%" }}
                className={`min-h-[400px] px-2 lg:px-6 overflow-hidden`}
            >
                <Shadcn_table
                    table_header={["Post Title", "Downloads", "Shares", "Engagement"]}
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

export default memo(PostEventList);
