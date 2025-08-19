"use client";
import React, { memo, useState } from "react";
import { useTableFilters } from "@/hooks/useTableFilters";
import SubHeader from "../../layout/header/sub-header";
import ShadcnPagination from "@/components/pagination";
import useWindowWidth from "@/hooks/useWindowWidth";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { RecentActivity } from "@/components/cards/recent-activity";
import { useGetAuditUserQuery } from "@/state/auth-api";

const RecentActivityList = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");

  const user = useSelector((state: RootState) => state?.user?.user);
  console.log(user);
  const { data, isLoading } = useGetAuditUserQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  const width = useWindowWidth();

  const result = data?.result || [];

  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
    "user","actionType"
  ]);

  return (
    <>
      <SubHeader
        searchTerm={searchTerm}
        placeHolder={"Search by User, Type"}
        setSearchTerm={setSearchTerm}
        setRowsPerPage={setRowsPerPage}
        dataCounter={data?.dataCounter}
      />
      <div
        style={{ width: width < 749 ? `${width}px` : "100%" }}
        className={`min-h-[400px] px-2 lg:px-6 overflow-hidden`}
      >
        <RecentActivity result={filteredItems || []} isLoading={isLoading} />
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

export default memo(RecentActivityList);
