"use client";
import ShadcnPagination from "@/components/pagination";
import Shadcn_table from "@/components/table/table";
import EventTooltip from "@/components/tooltip/event-tooltip";
import { TableCell, TableRow } from "@/components/ui/table";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useTableFilters } from "@/hooks/useTableFilters";
import useWindowWidth from "@/hooks/useWindowWidth";
import { TimeAgo } from "@/lib/timeAgo";
import SubHeader from "@/modules/layout/header/sub-header";
import { useGetAllStoragesQuery, useRemoveCloudStorageMutation } from "@/state/cloud-storage-api";
import { Trash2 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

export const Storages = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");
  const width = useWindowWidth();
  const { data, isLoading } = useGetAllStoragesQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });
  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(
    data?.result || [],
    ["storage_type"]
  );

  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeCloudStorage, { error, isSuccess }] = useRemoveCloudStorageMutation();

  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Storage Removed succesfuly.",
  });
  const removeHandler = useCallback(async (id: string) => {
    setRemovingId(id);
    await removeCloudStorage({ id });
    setRemovingId(null);
  }, [removeCloudStorage, setRemovingId]);

  const tableBody = useMemo(
    () =>
      filteredItems?.map((item, index) => (
        <TableRow key={item._id}>
          <TableCell className="font-medium">{index + 1}.</TableCell>
          <TableCell className="font-medium">{item.storage_type}</TableCell>
          <TableCell className="font-medium">{item.id}</TableCell>
          <TableCell>
            <TimeAgo time={item.updatedAt || ""} />
          </TableCell>
          <TableCell>
            <EventTooltip
              Icon={Trash2}
              description={"Delete"}
              isLoading={removingId === item._id}
              action={() => removeHandler(item._id)}
              style={"text-red-800 hover:text-white hover:bg-red-800"}
            />
          </TableCell>
        </TableRow>
      )),
    [filteredItems, removeHandler, removingId]
  );

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
        className={`px-2 lg:px-6 py-4 overflow-hidden`}
      >
        <Shadcn_table
          table_header={[
            "S.No",
            "Storage type",
            "id",
            "Last update",
            "Action",
          ]}
          tabel_body={() => tableBody}
          isLoading={isLoading}
        />
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <ShadcnPagination
            currentPage={currentPage}
            totalPages={Number(rowsPerPage)}
            setCurrentPage={setCurrentPage}
            data_length={data?.dataCounter || 10}
          />
        </div>
      </div>
    </>
  );
};
