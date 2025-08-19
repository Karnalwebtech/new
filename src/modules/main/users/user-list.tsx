"use client";
import React, { memo, useCallback, useMemo, useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import { Trash2, BadgeCheck, BadgeAlert, Eye, Ban } from "lucide-react";
import SubHeader from "../../layout/header/sub-header";
import Shadcn_table from "@/components/table/table";
import ShadcnPagination from "@/components/pagination";
import EventTooltip from "@/components/tooltip/event-tooltip";
import LinkTooltip from "@/components/tooltip/link-tooltip";
import { TimeAgo } from "@/lib/timeAgo";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useDeleteUserMutation, useGetAllUsersQuery } from "@/state/users-api";
import CopyBtn from "@/components/tooltip/copy-btn";

const UserList = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");
  const [removeId, setRemoveId] = useState<string>("");

  const { data, isLoading } = useGetAllUsersQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });
  const [deleteUser, { error, isSuccess }] = useDeleteUserMutation();
  const width = useWindowWidth();
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "User deactivated successfully!",
  });
  const result = data?.result || [];
  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
    "name",
    "ip",
    "email",
  ]);

  const removeHandler = useCallback(
    async (remove_id: string) => {
      setRemoveId(remove_id);
      await deleteUser({ id: remove_id });
      setRemoveId("");
    },
    [deleteUser]
  );
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
        <TableCell>{item.user}</TableCell>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>{item.phone}</TableCell>
        <TableCell>
          {item.isVerified ? (
            <BadgeCheck color="green" size={20} />
          ) : (
            <BadgeAlert size={20} color="red" />
          )}
        </TableCell>
        <TableCell>{item.role}</TableCell>
        <TableCell>{item.ip}</TableCell>
        <TableCell>
          {item.isAccountLocked ? (
            <Ban size={20} color="red" />
          ) : (
            <span> N/A</span>
          )}
        </TableCell>

        <TableCell>{<TimeAgo time={item.updatedAt || ""} />}</TableCell>
        <TableCell>
          <CopyBtn
           message="Uesr id copy"
           id={item?._id}
          />
          <LinkTooltip
            Icon={Eye}
            description={"Edit"}
            path={`/dashboard/users/${item.user}`}
            style={"text-green-800 hover:text-white hover:bg-green-800"}
          />
          <EventTooltip
            disabled={item.isAccountLocked}
            Icon={Trash2}
            description={"Delete"}
            isLoading={removeId === item._id}
            action={() => removeHandler(item?._id)}
            style={"text-red-800 hover:text-white hover:bg-red-800"}
          />
        </TableCell>
      </TableRow>
    ));
  }, [filteredItems, removeId, removeHandler]);
  return (
    <>
      <SubHeader
        searchTerm={searchTerm}
        placeHolder={"Search by name, ip, email"}
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
            "S:no",
            "Id",
            "Name",
            "Email",
            "Phone",
            "Status",
            "Role",
            "IP",
            "Block",
            "Last update",
            "Action",
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

export default memo(UserList);
