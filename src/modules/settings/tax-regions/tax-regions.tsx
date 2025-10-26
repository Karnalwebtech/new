"use client";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import Shadcn_table from "@/components/table/table";
import useWindowWidth from "@/hooks/useWindowWidth";
import { TruncateText } from "@/components/truncate-text";
import ShadcnPagination from "@/components/pagination";
import { containerVariants } from "@/lib/variants";
import { Eye, MapPinned, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import PageHeander2 from "@/modules/layout/header/page-heander2";
import {
  useDeleteTaxRegionMutation,
  useGetAllTaxRegionDataQuery,
} from "@/state/tax-region-api";
import ReactCountryFlag from "react-country-flag";
import { TaxRegionType } from "@/types/tax-region-type";
import NoRecordsCard from "@/components/cards/no-records-card";

const Row = memo(
  ({
    item,
    router,
    removeHandler,
    deletedId,
    provinces,
  }: {
    router: ReturnType<typeof useRouter>;
    item: TaxRegionType;
    removeHandler: (id: string) => void;
    deletedId: string;
    provinces?:string;
  }) => {
    return (
      <TableRow className="group hover:bg-muted/40 transition-colors duration-200">
        <TableCell className="flex gap-2 item-center">
          <span className="border border-gray-300 p-[4px] bg-gray-100 rounded-lg">
            {item.province_id ? (
              <MapPinned size={18} />
            ) : (
              <ReactCountryFlag
                countryCode={item?.country_id?.isoCode || ""}
                svg
                style={{ width: "1.25rem", height: "1.25rem" }}
                title={item?.country_id?.isoCode}
              />
            )}
          </span>
          <span className="text-muted-foreground">
            <TruncateText
              text={
                item.province_id
                  ? item?.province_id?.name || ""
                  : item?.country_id?.name || ""
              }
              maxLength={25}
            />
          </span>
        </TableCell>
        <TableCell className="text-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-in fade-in">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    item.province_id
                      ? `/settings/tax-regions/${provinces}/${item.province_id?.countryCode}/${item?.id}/edit`
                      : `/settings/tax-regions/${item?.id}/edit`
                  )
                }
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    item.province_id
                      ? `/settings/tax-regions/${provinces}/${item.province_id?.countryCode}/${item?.id}`
                      : `/settings/tax-regions/${item?.id}`
                  )
                }
              >
                <Eye className="h-4 w-4 mr-2" /> Preview
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={deletedId === item?.id}
                className="text-destructive cursor-pointer"
                onClick={() => item?._id && removeHandler(item.id!)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  }
);
Row.displayName = "Row";
interface TaxRegionProps {
  provinces?: string;
  isoCode?: string;
}
const TaxRegion = ({ provinces, isoCode = "null" }: TaxRegionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const [
    deleteTaxRegion,
    { isLoading: deleteLoading, isSuccess: deleteSuccess, error: deteError },
  ] = useDeleteTaxRegionMutation();
  const { data, isLoading, error } = useGetAllTaxRegionDataQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
    country_code: isoCode,
  });

  useHandleNotifications({
    error: deteError || error,
    isSuccess: deleteSuccess,
    successMessage: deleteSuccess ? "Tax-regions deleted successfully!" : "",
  });

  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data?.result]);
  const { filteredItems, searchTerm, setSearchTerm } = useTableFilters(result, [
    "name",
    "country_id.name",
  ]);

  const removeHandler = useCallback((id: string) => {
    setIsOpen(true);
    setDeletedId(id);
  }, []);

  const DeleteHandler = useCallback(async () => {
    if (deletedId) await deleteTaxRegion({ id: deletedId });
  }, [deleteTaxRegion, deletedId]);

  useEffect(() => {
    if (deleteSuccess) {
      setIsOpen(false);
      setDeletedId(null);
    }
  }, [deleteSuccess]);
  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center py-8">
           <NoRecordsCard/>
          </TableCell>
        </TableRow>
      );
    }

    return filteredItems.map((item, i) => (
      <Row
        key={`${item._id!}-${i}`}
        item={item}
        router={router}
        removeHandler={removeHandler}
        deletedId={deletedId!}
        provinces={provinces}
      />
    ));
  }, [filteredItems, router, removeHandler, deletedId,provinces]);

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto py-8">
        <PageHeander2
          headerTitle={provinces?"States":"Tax Regions"}
          headerDescription={provinces?"":"Manage what you charge your customers when they shop from different countries and regions."}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          subHeader={true}
          navLink={
            provinces
              ? `/settings/tax-regions/${provinces}/${isoCode}/create`
              : `/settings/tax-regions/create`
          }
        />

        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
            {/* Loader Overlay */}
            <AnimatePresence>
              {isLoading ||
                (deleteLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                    />
                  </motion.div>
                ))}
            </AnimatePresence>

            <Shadcn_table
              table_header={["Region", "Action"]}
              tabel_body={() => tableBody}
              isLoading={isLoading}
              textend="Payment Providers"
            />
          </div>

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
      </div>
      {/* Delete Confirmation */}
      <AnimatePresence>
        {isOpen && (
          <AlertDialogComponenet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Are you sure?"
            description="This action cannot be undone. This will permanently delete the tax region."
            action={DeleteHandler}
            type="danger"
            setDeletedId={setDeletedId}
            isLoading={deleteLoading}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(TaxRegion);
