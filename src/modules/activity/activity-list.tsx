"use client";
import React, { memo, useMemo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import { Globe, MapPin } from "lucide-react";
import SubHeader from "../layout/header/sub-header";
import Shadcn_table from "@/components/table/table";
import ShadcnPagination from "@/components/pagination";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useTrackFromIpLogsQuery } from "@/state/track-user-api";
import { formatDate } from "@/services/helpers";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

const ActivityList = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");

  const user = useSelector((state: RootState) => state?.user?.user);
  console.log(user);
  const { data, isLoading } = useTrackFromIpLogsQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  const width = useWindowWidth();

  const result = data?.result || [];

  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
    "id",
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
        <TableCell>{index + 1}</TableCell>
        <TableCell>{item.id}</TableCell>
        <TableCell className="font-medium">
          {formatDate(item.createdAt || "", "short", true)}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Globe size="15" />
            <span>
              {item.ip?.browser}, {item.ip?.os}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <MapPin size="15" />
            <span>
              {item.ip?.geoLocation?.city},{item.ip?.geoLocation?.country}
            </span>
          </div>
        </TableCell>
        <TableCell>{item.ip?.ip}</TableCell>
        <TableCell>{item.actionType}</TableCell>
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
          table_header={[
            "S.no",
            "Id",
            "Date & Time",
            "Device",
            "Location",
            "IP Address",
            "Status",
          ]}
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

export default memo(ActivityList);
