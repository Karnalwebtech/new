"use client";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import NavigateBtn from "@/components/buttons/navigate-btn";
import BusinessProfileCard from "@/components/cards/business-profile-card";
import ShadcnPagination from "@/components/pagination";
import { BusinessCardSkeleton } from "@/components/skeletons/busines-card-skeleton";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import {
  useDeleteStockLocationMutation,
  useGetAllStockLocationQuery,
} from "@/state/stock-location-api";
import { AnimatePresence } from "framer-motion";
import { BaggageClaim, ChevronRight, Truck } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const Locations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const { data, isLoading, error } = useGetAllStockLocationQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });
  const [
    deleteStockLocation,
    { isLoading: delteLoading, error: deleteError, isSuccess: deleteSuccess },
  ] = useDeleteStockLocationMutation();

  useHandleNotifications({
    error: error || deleteError,
    isSuccess: deleteSuccess,
    successMessage: `Stock location delete successfully!`,
  });

  const result = useMemo(() => data?.result || [], [data?.result]);

  const DeleteHandler = useCallback(async () => {
    if (deletedId) await deleteStockLocation({ id: deletedId });
  }, [deleteStockLocation, deletedId]);

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
    <>
      <div className="grid grid-cols-12 gap-2 pr-2">
        <div className="col-span-12 md:col-span-8 ">
          <Card className="bg-gray-50">
            <CardContent className="p-4 block md:grid md:grid-cols-12 gap-2">
              <div className="col-span-8">
                <CardTitle>Locations & Shipping</CardTitle>
                <p className="text-gray-700 text-sm">
                  Manage your store&apos;s stock locations and shipping options.
                </p>
              </div>
              <div className="mt-4 md:mt-0 col-span-4 flex md:justify-end">
                <NavigateBtn
                  path={"/settings/locations/create"}
                  title={"Create"}
                />
              </div>
            </CardContent>
          </Card>

          {isLoading || delteLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div className="my-4" key={i}>
                  <BusinessCardSkeleton />
                </div>
              ))
            : result?.map((item, i) => (
                <BusinessProfileCard
                  key={i}
                  item={item}
                  removeHandler={removeHandler}
                  deletedId={deletedId!}
                />
              ))}

          {/* Pagination */}
          {data && data.dataCounter > Number(rowsPerPage) && (
            <ShadcnPagination
              leftRightBtn={true}
              currentPage={currentPage}
              totalPages={Number(rowsPerPage)}
              setCurrentPage={setCurrentPage}
              data_length={data.dataCounter || 10}
            />
          )}
        </div>
        <Card className="bg-gray-50 col-span-12 md:col-span-4">
          <CardContent className="p-4">
            <CardTitle>Shipping Configuration</CardTitle>
            <div className="mt-4">
              <Link href={"/settings/locations/shipping-profiles"}>
                <div className="grid grid-cols-12 gap-2 place-items-start hover:bg-gray-50 bg-white p-2 border rounded-md">
                  <div className="bg-gray-50 p-2 col-span-1 block rounded-md border">
                    <BaggageClaim size={16} />
                  </div>
                  <div className="col-span-10 pl-4">
                    <p className="text-sm font-semibold">Shipping Profiles</p>
                    <p className="text-xs text-gray-700">
                      Group products by shipping requirements
                    </p>
                  </div>
                  <div className="col-span-1 pt-3">
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            </div>
            <div className="mt-2">
              <Link href={"/settings/locations/shipping-option-types"}>
                <div className="grid grid-cols-12 gap-2 place-items-start hover:bg-gray-50 bg-white p-2 border rounded-md">
                  <div className="bg-gray-50 p-2 col-span-1 block rounded-md border">
                    <Truck size={16} />
                  </div>
                  <div className="col-span-10 pl-4">
                    <p className="text-sm font-semibold">
                      Shipping Option Types
                    </p>
                    <p className="text-xs text-gray-700">
                      Group shipping options by types
                    </p>
                  </div>
                  <div className="col-span-1 pt-3">
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {isOpen && (
          <AlertDialogComponenet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Are you sure?"
            description="This action cannot be undone. This will permanently stock location."
            action={DeleteHandler}
            type="danger"
            setDeletedId={setDeletedId}
            isLoading={delteLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Locations;
