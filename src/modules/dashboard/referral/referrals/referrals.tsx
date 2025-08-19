"use client";
import ShadcnPagination from "@/components/pagination";
import Shadcn_table from "@/components/table/table";
import EventTooltip from "@/components/tooltip/event-tooltip";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useTableFilters } from "@/hooks/useTableFilters";
import useWindowWidth from "@/hooks/useWindowWidth";
import { TimeAgo } from "@/lib/timeAgo";
import SubHeader from "@/modules/layout/header/sub-header";
import { formatCurrency } from "@/services/currency";
import {
  useGetReferralsQuery,
  useReferraldetailsQuery,
  useUpdateClaimMutation,
} from "@/state/referral-api";
import { ReceiptIndianRupee } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

export const Referrals = () => {
  const width = useWindowWidth();
  const [claimId, setClaimId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");
  const { data: referralDetailsData } = useReferraldetailsQuery();
  const { data, isLoading } = useGetReferralsQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });
  const [updateClaim, { isLoading: UpdateLoading, error, isSuccess }] =
    useUpdateClaimMutation();
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Claim is under processing",
  });

  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(
    data?.result || [],
    ["referralCode"]
  );

  const clameHandler = useCallback(
    async (amount: string, id: string) => {
      setClaimId(id);
      await updateClaim({ amount, id });
    },
    [updateClaim, setClaimId]
  );

  const tableBody = useMemo(
    () =>
      filteredItems?.map((item, index) => {
        // Check if item._id exists in rewardClaims
        const isClaimed = referralDetailsData?.result?.rewardClaims?.some(
          (claim) => claim === item?._id
        );

        return (
          <TableRow key={index}>
            <TableCell className="font-medium">{index + 1}.</TableCell>
            <TableCell className="font-medium">
              <div>{item?.user?.name}</div>
            </TableCell>
            <TableCell className="font-medium">
              <div>{item?.user?.email}</div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  item?.referralStatus === "active" ? "default" : "secondary"
                }
              >
                {item?.referralStatus === "active" ? "Converted" : "Pending"}
              </Badge>
            </TableCell>
            <TableCell>
              {formatCurrency(Number(item?.rewardAmount) || 0)}
            </TableCell>
            <TableCell>
              <TimeAgo time={item.createdAt || ""} />
            </TableCell>
            <TableCell>
              <EventTooltip
                disabled={
                  isClaimed || item?.referralStatus !== "active" ? true : false
                }
                Icon={ReceiptIndianRupee}
                description={"Claim"}
                isLoading={UpdateLoading && claimId === item._id}
                action={() => clameHandler(item?.rewardAmount, item?._id)}
                style={"text-green-800 hover:text-white hover:bg-green-800"}
              />
            </TableCell>
          </TableRow>
        );
      }),
    [filteredItems, claimId, clameHandler, UpdateLoading, referralDetailsData]
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
        className="overflow-hidden p-4"
        style={{ width: width < 749 ? `${width}px` : "100%" }}
      >
        <Shadcn_table
          table_header={[
            "S.No",
            "Name",
            "Email",
            "Status",
            "Reward",
            "Date",
            "Action",
          ]}
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
};
