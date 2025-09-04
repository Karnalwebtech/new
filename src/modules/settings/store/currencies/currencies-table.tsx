"use client";

import type React from "react";
import { memo, useMemo, useState } from "react";
import NavigateBtn from "@/components/buttons/navigate-btn";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import Shadcn_table from "@/components/table/table";
import useWindowWidth from "@/hooks/useWindowWidth";
import { motion, AnimatePresence } from "framer-motion";
import { TruncateText } from "@/components/truncate-text";
import { containerVariants, itemVariants } from "@/lib/variants";
import ShadcnPagination from "@/components/pagination";
import { useGetAllCurrenciesQuery } from "@/state/currency-api";
import { Checkbox } from "@/components/ui/checkbox";
import { CurrencyItem } from "@/types/currency-type";
import { Switch } from "@/components/ui/switch";

// 🔹 Optimized reusable Row component
const Row = memo(({ item, index }: { item: CurrencyItem; index: number }) => {
  const rowId = `${item._id || item.code}-${index}`;

  return (
    <>
      <motion.tr
        key={rowId}
        variants={itemVariants}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group hover:bg-muted/40 transition-colors duration-200"
      >
        <TableCell>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Checkbox
              // checked={isChecked}
              // onCheckedChange={(v) => onCheckChange(!!v)}
              // aria-label={`Select ${item.code}`}
              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            />
          </motion.div>
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item.code! || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item.name! || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell className="text-right pr-6">
          <Switch
            // checked={taxInclusive}
            // onCheckedChange={(v) => onToggleTax(item.code, v)}
            aria-label={`Toggle tax inclusive pricing for ${item.code}`}
          />
        </TableCell>
      </motion.tr>
    </>
  );
});
Row.displayName = "Row";
interface CurrenciesTableProps {
  selected: string[];
  setSelected?: (selected: string[]) => void;
  taxMap?: Record<string, boolean>;
  setTaxMap?: (map: Record<string, boolean>) => void;
}
// 🔹 Main Component
const CurrenciesTable = ({
  selected,
  setSelected,
  taxMap,
  setTaxMap,
}: CurrenciesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const { data, isLoading } = useGetAllCurrenciesQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
  });
  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data]);
  const { searchTerm, setSearchTerm, filteredItems } = useTableFilters(result, [
    "name",
  ]);

  // Memoized Table Body
  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8"
            >
              <div className="text-muted-foreground text-lg mb-2">
                No CurrenciesTable found
              </div>
              <div className="text-sm text-muted-foreground/70">
                Try adjusting your search criteria
              </div>
            </motion.div>
          </TableCell>
        </TableRow>
      );
    }
    return (
      <AnimatePresence>
        {filteredItems.map((item, i) => (
          <Row key={i} item={item} index={i} 
          
          />
        ))}
      </AnimatePresence>
    );
  }, [filteredItems]);

  return (
    <motion.div
      className="min-h-screen bg-background mb-14"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto py-8">
        {/* Header */}
        <motion.div
          className="flex px-4 items-center justify-between mb-8"
          variants={itemVariants}
        >
          <motion.div>
            <motion.h1 className="text-2xl font-semibold text-foreground mb-2">
              CurrenciesTable
            </motion.h1>
            <motion.p className="text-muted-foreground">
              Manage and organize product CurrenciesTable.
            </motion.p>
          </motion.div>
          <motion.div className="flex items-center gap-3">
            <NavigateBtn
              path="/dashboard/products/CurrenciesTable/organize"
              title="Edit ranking"
              style="btn-primary"
            />
            <NavigateBtn
              path="/dashboard/products/CurrenciesTable/create"
              title="Create"
              style="btn-primary"
            />
          </motion.div>
        </motion.div>

        {/* Table */}
        <motion.div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
            {/* Loader Overlay */}
            <AnimatePresence>
              {isLoading && (
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
              )}
            </AnimatePresence>

            <Shadcn_table
              table_header={[
                "checkbox",
                "Code",
                "Name",
                "Tax inclusive pricing",
              ]}
              isCheckbox={true}
              tabel_body={() => tableBody}
              isLoading={isLoading}
            />
          </div>

          {/* Pagination */}
          {data && data?.dataCounter > Number(rowsPerPage) && (
            <ShadcnPagination
              leftRightBtn={true}
              currentPage={currentPage}
              totalPages={Number(rowsPerPage)}
              setCurrentPage={setCurrentPage}
              data_length={data?.dataCounter || 10}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default memo(CurrenciesTable);
