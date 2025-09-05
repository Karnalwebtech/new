"use client";
import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTableFilters } from "@/hooks/useTableFilters";
import Shadcn_table from "@/components/table/table";
import useWindowWidth from "@/hooks/useWindowWidth";
import { TruncateText } from "@/components/truncate-text";
import ShadcnPagination from "@/components/pagination";
import { useGetAllCurrenciesQuery } from "@/state/currency-api";
import { Checkbox } from "@/components/ui/checkbox";
import type { CurrencyItem } from "@/types/currency-type";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { controls } from "@/lib/variants";
import { useDebounced } from "@/hooks/useDebounced";

const Row = memo(
  ({
    item,
    onToggleTax,
    onCheckChange,
    taxInclusive,
    isChecked,
  }: {
    item: CurrencyItem;
    isChecked: boolean;
    index: number;
    onCheckChange: (next: boolean) => void;
    onToggleTax: (code: string, next: boolean) => void;
    taxInclusive: boolean;
  }) => {
    return (
      <TableRow className="group hover:bg-muted/40 transition-colors duration-200">
        <TableCell>
          <Checkbox
            checked={isChecked}
            onCheckedChange={(v) => onCheckChange(!!v)}
            aria-label={`Select ${item.code}`}
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
          />
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item.code || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell>
          <span className="text-muted-foreground">
            <TruncateText text={item.name || ""} maxLength={25} />
          </span>
        </TableCell>
        <TableCell className="text-right pr-6">
          <Switch
            checked={taxInclusive}
            onCheckedChange={(v) => onToggleTax(item.code, v)}
            aria-label={`Toggle tax inclusive pricing for ${item.code}`}
          />
        </TableCell>
      </TableRow>
    );
  }
);
Row.displayName = "Row";

interface CurrenciesTableProps {
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  taxMap: Record<string, boolean>;
  setTaxMap: Dispatch<SetStateAction<Record<string, boolean>>>;
}

const CurrenciesTable = ({
  selected,
  setSelected,
  taxMap = {},
  setTaxMap,
}: CurrenciesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const [search, setSearch] = useState<string>("");
  const { data, isLoading } = useGetAllCurrenciesQuery({
    rowsPerPage: Number(rowsPerPage),
    page: currentPage,
    keywords: useDebounced(search, 500),
  });

  const width = useWindowWidth();
  const result = useMemo(() => data?.result || [], [data?.result]);

  const { filteredItems } = useTableFilters(result, ["name"]);

  const handleToggleTax = useCallback(
    (code: string, next: boolean) => {
      if (!setTaxMap) return;
      setTaxMap((prev) => {
        if (prev[code] === next) return prev;
        return { ...prev, [code]: next };
      });
    },
    [setTaxMap]
  );

  const toggleCode = useCallback(
    (code: string, checked: boolean) => {
      if (!setSelected) return;
      setSelected((prev) => {
        if (checked) {
          return prev.includes(code) ? prev : [...prev, code];
        }
        return prev.filter((c) => c !== code);
      });
    },
    [setSelected]
  );
  const selectedOnPageCount = useMemo(
    () => filteredItems.filter((c) => selected.includes(c.code)).length,
    [filteredItems, selected]
  );
  const headerCheckedState: boolean | "indeterminate" = useMemo(() => {
    if (filteredItems.length === 0) return false;
    if (selectedOnPageCount === 0) return false;
    if (selectedOnPageCount === filteredItems.length) return true;
    return "indeterminate";
  }, [filteredItems.length, selectedOnPageCount]);
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
        key={`${item._id || item.code}-${i}`}
        item={item}
        index={i}
        onToggleTax={handleToggleTax}
        isChecked={selected.includes(item.code)}
        onCheckChange={(next) => toggleCode(item.code, next)}
        taxInclusive={taxMap[item.code] || false}
      />
    ));
  }, [filteredItems, handleToggleTax, toggleCode, taxMap, selected]);

  const toggleSelectAllOnPage = useCallback(
    (nextChecked: boolean) => {
      setSelected((prev) => {
        if (nextChecked) {
          // add all codes on this page
          const set = new Set(prev);
          result.forEach((c) => set.add(c?.code));
          return Array.from(set);
        } else {
          // remove all codes on this page
          return [];
        }
      });
    },
    [result, setSelected]
  );

  return (
    <div className="min-h-screen bg-background mb-14">
      <div className="container mx-auto py-8">
        <div className="flex px-4 items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Currencies
            </h1>
            <p className="text-muted-foreground">
              Manage and organize product currencies.
            </p>
          </div>
          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          >
            {/* Search */}
            <motion.div
              variants={controls}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="max-w-lg  flex-1"
            >
              <Input
                type="text"
                value={search}
                placeholder="Search currencies..."
                onChange={(e) => setSearch(e.target.value)}
                className="transition-all focus-visible:shadow-[0_0_0_2px_rgba(59,130,246,.25)]"
              />
            </motion.div>

            {/* Per page Select */}
            <motion.div
              variants={controls}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Select
                value={rowsPerPage}
                onValueChange={(val) => {
                  setRowsPerPage(val); // val is a string
                  setCurrentPage(1); // optional: reset page
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Per page" />
                </SelectTrigger>

                {/* Animate dropdown content on mount/unmount */}
                <SelectContent>
                  <AnimatePresence>
                    <motion.div
                      key="select-content"
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                    >
                      <SelectGroup>
                        <SelectLabel>Per page</SelectLabel>
                        <SelectItem value="10">10 / page</SelectItem>
                        <SelectItem value="20">20 / page</SelectItem>
                        <SelectItem value="50">50 / page</SelectItem>
                        <SelectItem value="100">100 / page</SelectItem>
                        <SelectItem value="500">500 / page</SelectItem>
                        <SelectItem value="1000">1000 / page</SelectItem>
                      </SelectGroup>
                    </motion.div>
                  </AnimatePresence>
                </SelectContent>
              </Select>
            </motion.div>
          </motion.div>
        </div>

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
              table_header={[
                "checkbox",
                "Code",
                "Name",
                "Tax inclusive pricing",
              ]}
              isAllSelected={headerCheckedState}
              isCheckbox={true}
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
    </div>
  );
};

export default memo(CurrenciesTable);
