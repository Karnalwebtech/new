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
  useDeleteStoreCurrencyMutation,
  useGetAllStoreCurrenciesQuery,
} from "@/state/store-currency-api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleCheck, CircleX, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreCurrenciesType } from "@/types/store-currincies-type";
import { AlertDialogComponenet } from "@/components/alert-dialog";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useUpdateTaxPriceStoreCurrencyMutation } from "../../../state/store-currency-api";
import StatusIndicator from "@/components/status-indicator";
import { TableEmptyState } from "@/components/table/table-empty-state";
import PageHeander2 from "@/modules/layout/header/page-heander2";
import TableLoader from "@/components/table/table-loader";

const Row = memo(
  ({
    item,
    removeHandler,
    toggleTaxPricing,
    deletedId,
  }: {
    item: StoreCurrenciesType;
    removeHandler: (id: string) => void;
    deletedId: string | null;
    toggleTaxPricing: (id: string) => void;
  }) => {
    return (
      <TableRow className="group hover:bg-muted/40 transition-colors duration-200">
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item.currency_id?.code || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item.currency_id?.name || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell className="text-right pr-6 text-gray-700">
          <StatusIndicator
            enabled={item?.tax_inclusive}
            trueLabel="True"
            falseLabel="False"
            align="end"
            // size={40}
          />
        </TableCell>

        <TableCell className="text-right pr-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Table actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => item?._id && toggleTaxPricing(item._id)}
                className="cursor-pointer p-[4px]"
              >
                {item?.tax_inclusive ? (
                  <CircleX className="h-4 w-4" />
                ) : (
                  <CircleCheck className="h-4 w-4" />
                )}{" "}
                {item?.tax_inclusive ? "Disable" : "Enabble"} tax inclusive
                pricing
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={deletedId === item?.id}
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

const StoreCurrencies = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const [
    deleteStoreCurrency,
    { isLoading: delteLoading, error: deleteError, isSuccess: deleteSuccess },
  ] = useDeleteStoreCurrencyMutation();
  const [
    updateTaxPriceStoreCurrency,
    { isLoading: UpdateLoading, error: UpdateError, isSuccess: UpdateSuccess },
  ] = useUpdateTaxPriceStoreCurrencyMutation();
  const { data, isLoading, error } = useGetAllStoreCurrenciesQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  useHandleNotifications({
    error: error || deleteError || UpdateError,
    isSuccess: deleteSuccess || UpdateSuccess,
    successMessage: `Store currency ${
      UpdateSuccess ? "update" : "delete"
    } successfully!`,
  });
  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data?.result]);

  const { filteredItems, searchTerm, setSearchTerm } = useTableFilters(result, [
    "id",
  ]);

  const DeleteHandler = useCallback(async () => {
    console.log(deletedId);
    if (deletedId) await deleteStoreCurrency({ id: deletedId });
  }, [deleteStoreCurrency, deletedId]);

  const removeHandler = useCallback((id: string) => {
    setIsOpen(true);
    setDeletedId(id);
  }, []);

  const toggleTaxPricing = useCallback(
    async (id: string) => {
      if (id) await updateTaxPriceStoreCurrency({ id: id });
    },
    [updateTaxPriceStoreCurrency]
  );

  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return <TableEmptyState colSpan={4} />;
    }

    return filteredItems.map((item, i) => (
      <Row
        key={i}
        item={item}
        removeHandler={removeHandler}
        deletedId={deletedId}
        toggleTaxPricing={toggleTaxPricing}
      />
    ));
  }, [filteredItems, deletedId, removeHandler, toggleTaxPricing]);

  useEffect(() => {
    if (deleteSuccess) {
      setIsOpen(false);
      setDeletedId(null);
    }
  }, [deleteSuccess]);
  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto py-8">
        <PageHeander2
          headerTitle={"Currencies"}
          headerDescription={"Manage and organize product currencies."}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          subHeader={true}
          setSearchTerm={setSearchTerm}
          is_btn={true}
          navLink={`/settings/store/currencies`}
        />

        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
            {(isLoading || delteLoading || UpdateLoading) && <TableLoader />}

            <Shadcn_table
              table_header={["Code", "Name", "Tax inclusive pricing", "Action"]}
              tabel_body={() => tableBody}
              isLoading={isLoading || delteLoading || UpdateLoading}
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
            description="This action cannot be undone. This will permanently delete the category."
            action={DeleteHandler}
            type="danger"
            setDeletedId={setDeletedId}
            isLoading={delteLoading}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default memo(StoreCurrencies);
