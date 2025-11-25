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
import {
  useDeleteRegionMutation,
  useGetAllRegionseDataQuery,
} from "../../../state/regions-api";
import { RegionCountryData } from "@/types/regions-type";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { TableEmptyState } from "../../../components/table/table-empty-state";
import PageHeander2 from "@/modules/layout/header/page-heander2";

const Row = memo(
  ({
    item,
    router,
    removeHandler,
    deletedId,
  }: {
    router: ReturnType<typeof useRouter>;
    item: RegionCountryData;
    removeHandler: (id: string) => void;
    deletedId: string;
  }) => {
    return (
      <TableRow className="group hover:bg-muted/40 transition-colors duration-200">
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item?.name || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText
              text={
                item?.countries?.length <= 3
                  ? item.countries.map((c) => c?.name).join(", ")
                  : `${item.countries
                      .slice(0, 3)
                      .map((c) => c?.name)
                      .join(", ")}... more`
              }
              maxLength={25}
            />
          </span>
        </TableCell>
        <TableCell className="text-right pr-6">
          <span className="text-muted-foreground">
            <TruncateText text={"test"} maxLength={25} />
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
                  router.push(`/settings/regions/${item?.id}/edit`)
                }
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(`/settings/regions/${item?.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" /> Preview
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={deletedId === item?._id}
                className="text-destructive cursor-pointer"
                onClick={() => item?._id && removeHandler(item._id)}
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

const Region = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const [
    deleteRegion,
    { isLoading: deleteLoading, isSuccess: deleteSuccess, error: deteError },
  ] = useDeleteRegionMutation();
  const { data, isLoading, error } = useGetAllRegionseDataQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  useHandleNotifications({
    error: deteError || error,
    isSuccess: deleteSuccess,
    successMessage: deleteSuccess ? "Regoin deleted successfully!" : "",
  });

  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data?.result]);
  const { filteredItems, searchTerm, setSearchTerm } = useTableFilters(result, [
    "name",
    "country_id.name",
    "region_id.name",
    "country.name",
    "region.name",
  ]);

  const removeHandler = useCallback((id: string) => {
    setIsOpen(true);
    setDeletedId(id);
  }, []);

  const DeleteHandler = useCallback(async () => {
    if (deletedId) await deleteRegion({ id: deletedId });
  }, [deleteRegion, deletedId]);

  useEffect(() => {
    if (deleteSuccess) {
      setIsOpen(false);
      setDeletedId(null);
    }
  }, [deleteSuccess]);
  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return <TableEmptyState colSpan={4} />;
    }

    return filteredItems.map((item, i) => (
      <Row
        key={`${item._id!}-${i}`}
        item={item}
        router={router}
        removeHandler={removeHandler}
        deletedId={deletedId!}
      />
    ));
  }, [filteredItems, router, removeHandler, deletedId]);

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto py-8">
        <PageHeander2
          headerTitle={"Regions"}
          headerDescription={
            " A region is an area that you sell products in. It can cover multiple countries, and has different tax rates, providers, and currency."
          }
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          subHeader={true}
          setSearchTerm={setSearchTerm}
          is_btn={true}
          navLink={`/settings/regions/create`}
        />

        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
            {/* Loader Overlay */}
           
            <Shadcn_table
              table_header={[
                "Name",
                "Countries",
                "Payment Providers",
                "Action",
              ]}
              tabel_body={() => tableBody}
              isLoading={isLoading || deleteLoading }
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
            description="You are about to delete the region. This action cannot be undone."
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

export default memo(Region);
