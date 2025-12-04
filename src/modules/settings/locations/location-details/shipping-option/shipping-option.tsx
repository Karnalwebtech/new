"use client";
import { AnimatePresence } from "framer-motion";
import {
  useDeleteShippingOptionMutation,
  useGetAllShippingOptionsQuery,
} from "@/state/shipping-options-api";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Trash2, Pencil, Package, MoreHorizontal } from "lucide-react";
import { capitalizeFirstLetter } from "@/services/helpers";
import ShadcnPagination from "@/components/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ParaSkeleton } from "@/components/skeletons/para-skeleton";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useRouter } from "next/navigation";
interface ShippingOptionProps {
  is_return?: boolean;
  serviseZone_id?: string;
  url: string;
}
const ShippingOption = ({
  serviseZone_id,
  is_return = false,
  url,
}: ShippingOptionProps) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const { data, isLoading } = useGetAllShippingOptionsQuery({
    is_return: is_return,
    service_zone_id: serviseZone_id,
    rowsPerPage: 10,
    page: currentPage,
  });
  const [
    deleteShippingOption,
    { isLoading: deleteLoading, isSuccess: deleteSuccess, error },
  ] = useDeleteShippingOptionMutation();
  useHandleNotifications({
    error: error,
    isSuccess: deleteSuccess,
    successMessage: deleteSuccess
      ? "Shipping option deleted successfully!"
      : "",
  });
  const result = useMemo(() => data?.result || [], [data]);
  const DeleteHandler = useCallback(async () => {
    if (deletedId) await deleteShippingOption({ id: deletedId });
  }, [deleteShippingOption, deletedId]);

  const removeHandler = useCallback((id: string) => {
    setIsOpen(true);
    setDeletedId(id);
  }, []);
  useEffect(() => {
    if (deleteSuccess) {
      setIsOpen(false);
      setDeletedId(null);
    }
  }, [deleteSuccess]);
  return (
    <div className="overflow-x-auto">
      {/* Table Body */}
      {isLoading || deleteLoading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-gray-100 py-2 px-4 hover:bg-gray-50 transition-colors animate-pulse"
            >
              <ParaSkeleton style={`w-full h-10`} />
            </div>
          ))
        : result.map((item) => (
            <div
              key={item.id}
              className={`grid grid-cols-12 border-b border-gray-100 py-4 px-4 hover:bg-gray-50 transition-colors`}
            >
              {/* Profile Name */}
              <div className="col-span-8 flex items-center">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100 text-gray-600`}>
                    <Package size={14} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-900">
                      {capitalizeFirstLetter(item.name)} -{" "}
                      {capitalizeFirstLetter(item.shipping_profile?.name)} (
                      {capitalizeFirstLetter(item?.provider?.name || "Not set")}
                      )
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-4 flex items-center justify-end relative">
                <div className="col-span-3 flex items-center">
                  <div className="text-sm text-gray-700">
                    {item.shipping_option_rules
                      .filter(
                        (filterRule) =>
                          filterRule?.attribute === "enabled_in_store"
                      )
                      .map((rule, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded bg-blue-100 text-blue-600 text-xs mr-1"
                        >
                          {rule.value ? "Store" : "Admin"}
                        </span>
                      ))}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Table actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push(`${url}/${item?.id}/edit`)}
                    >
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      // disabled={deletedId === item?._id}
                      className="text-destructive cursor-pointer"
                      onClick={() => item?.id && removeHandler(item?.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
      {data && data.dataCounter > 10 && (
        <div className="my-4 overflow-hidden">
          <ShadcnPagination
            leftRightBtn={true}
            currentPage={currentPage}
            totalPages={10}
            setCurrentPage={setCurrentPage}
            data_length={data.dataCounter || 10}
          />
        </div>
      )}
      <AnimatePresence>
        {isOpen && (
          <AlertDialogComponenet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Are you sure?"
            description="You are about to delete the shipping option. This action cannot be undone."
            action={DeleteHandler}
            type="danger"
            setDeletedId={setDeletedId}
            isLoading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(ShippingOption);
