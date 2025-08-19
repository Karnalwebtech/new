"use client";
import React, { memo, useMemo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import { Pencil } from "lucide-react";
import { TimeAgo } from "@/lib/timeAgo";
import Shadcn_table from "@/components/table/table";
import LinkTooltip from "@/components/tooltip/link-tooltip";
import SubHeader from "../../layout/header/sub-header";
import useWindowWidth from "@/hooks/useWindowWidth";
import ShadcnPagination from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { useGetAllContactUsQueriesQuery } from "@/state/contact-us-queries-api";

const QueryList = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");

  //---------- all hookes
  const { data, isLoading } = useGetAllContactUsQueriesQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  const width = useWindowWidth();
  const result = data?.result || [];
  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
    "name",
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
        <TableCell className="font-medium">{item.id}</TableCell>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell className="font-medium">{item.email}</TableCell>
        <TableCell className="font-medium">{item.phone}</TableCell>
        <TableCell className="font-medium">{item.subject}</TableCell>
        <TableCell>
          <Badge
            className="w-full text-center"
            variant={item?.is_read ? "default" : "secondary"}
          >
            {item.is_read ? "true" : "false"}
          </Badge>
        </TableCell>
        <TableCell>{<TimeAgo time={item.updatedAt} />}</TableCell>
        <TableCell>
          <LinkTooltip
            Icon={Pencil}
            description={"Edit"}
            path={`/dashboard/post/${item.id}`}
            style={"text-green-800 hover:text-white hover:bg-green-800"}
          />

        </TableCell>
      </TableRow>
    ));
  }, [filteredItems]);

  return (
    <>
      <SubHeader
        searchTerm={searchTerm}
        placeHolder={"Search by Fullname, Phone, email, si"}
        setSearchTerm={setSearchTerm}
        setRowsPerPage={setRowsPerPage}
        dataCounter={data?.dataCounter}
      />
      <div
        style={{ width: width < 749 ? `${width}px` : "100%" }}
        className={`min-h-[400px] px-2 lg:px-6 overflow-hidden`}
      >
        <Shadcn_table
          table_header={["ID", "Name", "Email", "Phone", "Subject", "Seen", "Last Update","Action"]}
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

export default memo(QueryList);
