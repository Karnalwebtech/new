"use client";
import { memo, useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import Shadcn_table from "@/components/table/table";
import useWindowWidth from "@/hooks/useWindowWidth";
import { TruncateText } from "@/components/truncate-text";
import ShadcnPagination from "@/components/pagination";
import { containerVariants } from "@/lib/variants";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import PageHeander2 from "@/modules/layout/header/page-heander2";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  bulkToggleCodes,
  toggleCode,
} from "@/reducers/healper-slice";
import { useGetAllFulFillmentProviderQuery } from "@/state/fullfillment-provider-api";
import { FulFillmentProviderType } from "@/types/fulfillment-provider-type";

const Row = memo(
  ({
    item,
    onCheckChange,
    isChild,
    isChecked,
  }: {
    item: FulFillmentProviderType;
    isChecked: boolean;
    onCheckChange: (next: boolean) => void;
    isChild: boolean;
  }) => {
    return (
      <TableRow className="group hover:bg-muted/40 transition-colors duration-200">
        {isChild && (
          <TableCell>
            <Checkbox
              checked={isChecked}
              onCheckedChange={(v) => onCheckChange(!!v)}
              aria-label={`Select ${item?._id}`}
              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            />
          </TableCell>
        )}
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item.name || ""} maxLength={25} />
          </span>
        </TableCell>
      </TableRow>
    );
  }
);
Row.displayName = "Row";
interface FulFillmentProviderProps {
  isChild?: boolean;
}
const FulFillmentProvider = ({ isChild = false }: FulFillmentProviderProps) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const { selected } = useSelector((state: RootState) => state.helper);

  const { data, isLoading, error } = useGetAllFulFillmentProviderQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });

  useHandleNotifications({
    error: error,
  });
  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data?.result]);

  const { filteredItems, searchTerm, setSearchTerm } = useTableFilters(result, [
    "name",
  ]);

  const selectedOnPageCount = useMemo(() => {
    if (!selected) return 0;
    return result.filter((c) => selected.includes(c._id!)).length;
  }, [result, selected]);

  const headerCheckedState: boolean | "indeterminate" = useMemo(() => {
    if (filteredItems.length === 0) return false;
    if (selectedOnPageCount === 0) return false;
    if (selectedOnPageCount === filteredItems.length) return true;
    return "indeterminate";
  }, [filteredItems.length, selectedOnPageCount]);

  const handleToggleCode = useCallback(
    (code: string, checked: boolean) => {
      dispatch(toggleCode({ code, checked }));
    },
    [dispatch]
  );

  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center py-8">
            <div className="text-muted-foreground text-lg mb-2">
              No currencies found
            </div>
            <div className="text-sm text-muted-foreground/70">
              Try adjusting your search criteria
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return filteredItems.map((item, i) => (
      <Row
        key={i}
        item={item}
        isChecked={Array.isArray(selected) && selected.includes(item._id!)}
        onCheckChange={(next) => handleToggleCode(item._id!, next)}
        isChild={isChild}
      />
    ));
  }, [filteredItems, selected, handleToggleCode, isChild]);

  const toggleSelectAllOnPage = useCallback(
    (nextChecked: boolean) => {
      dispatch(
        bulkToggleCodes({
          codes: result.map((c) => c._id!),
          checked: nextChecked,
        })
      );
    },
    [dispatch, result]
  );

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto pb-8">
        <PageHeander2
          headerTitle={isChild ? "" : "Sales Channels"}
          headerDescription={
            isChild
              ? ""
              : "Manage the online and offline channels you sell products on."
          }
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          subHeader={isChild ? false : true}
          setSearchTerm={setSearchTerm}
          is_btn={isChild ? false : true}
          navLink={`/settings/sales-channels/create`}
        />

        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
            {isLoading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <Shadcn_table
              table_header={isChild ? ["checkbox", "Name"] : ["Name"]}
              isAllSelected={headerCheckedState}
              isCheckbox={isChild}
              handleSelectAll={(e) => toggleSelectAllOnPage(e)}
              tabel_body={() => tableBody}
              isLoading={isLoading}
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
    </motion.div>
  );
};

export default memo(FulFillmentProvider);
