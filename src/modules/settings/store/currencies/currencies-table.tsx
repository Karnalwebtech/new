"use client";

import React, { memo, useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// shadcn ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// helpers
import { TruncateText } from "@/components/truncate-text";
import useWindowWidth from "@/hooks/useWindowWidth";
import { containerVariants } from "@/lib/variants";
import { CurrencyItem } from "./currencies";

// ---- Row (animated) ---------------------------------------------------------

const Row = memo(function Row({
  item,
  isChecked,
  onCheckChange,
  taxInclusive,
  onToggleTax,
}: {
  item: CurrencyItem;
  isChecked: boolean;
  onCheckChange: (next: boolean) => void;
  taxInclusive: boolean;
  onToggleTax: (code: string, next: boolean) => void;
}) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="group hover:bg-muted/40 transition-colors"
    >
      <TableCell className="w-[56px]">
        <Checkbox
          checked={isChecked}
          onCheckedChange={(v) => onCheckChange(!!v)}
          aria-label={`Select ${item.code}`}
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
        />
      </TableCell>

      <TableCell className="w-[140px]">
        <span className="text-muted-foreground">
          <TruncateText text={item.code} maxLength={25} />
        </span>
      </TableCell>

      <TableCell>
        <span className="text-muted-foreground">
          <TruncateText text={item.name} maxLength={48} />
        </span>
      </TableCell>

      <TableCell className="text-right pr-6">
        <Switch
          checked={taxInclusive}
          onCheckedChange={(v) => onToggleTax(item.code, v)}
          aria-label={`Toggle tax inclusive pricing for ${item.code}`}
        />
      </TableCell>
    </motion.tr>
  );
});

// ---- Main -------------------------------------------------------------------
interface CurrenciesTableProps {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  taxMap: Record<string, boolean>;
  setTaxMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  allCurrencies?: CurrencyItem[];
}
const CurrenciesTable = ({
  selected,
  setSelected,
  taxMap,
  setTaxMap,
  allCurrencies = [],
}: CurrenciesTableProps) => {
  const width = useWindowWidth();

  // Search
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCurrencies;
    return allCurrencies.filter(
      (x) =>
        x.code.toLowerCase().includes(q) ||
        x.name.toLowerCase().includes(q) ||
        (x.countries?.some((cty: string) => cty.toLowerCase().includes(q)) ??
          false)
    );
  }, [allCurrencies, query]);

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const clampedPage = Math.min(page, totalPages);
  const startIndex = (clampedPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const pageSlice = useMemo(
    () => filtered.slice(startIndex, endIndex),
    [filtered, startIndex, endIndex]
  );

  // Reset page when query or page size changes
  useEffect(() => setPage(1), [query, rowsPerPage]);

  // Tax map per code

  const handleToggleTax = useCallback(
    (code: string, next: boolean) => {
      setTaxMap((m) => (m[code] === next ? m : { ...m, [code]: next }));
    },
    [setTaxMap]
  );

  // Selection (store only codes)

  const toggleCode = useCallback(
    (code: string, checked: boolean) => {
      setSelected((prev) =>
        checked
          ? prev.includes(code)
            ? prev
            : [...prev, code]
          : prev.filter((c) => c !== code)
      );
    },
    [setSelected]
  );

  // Header select-all (per current page)
  const pageCodes = useMemo(() => pageSlice.map((x) => x.code), [pageSlice]);
  const selectedOnPageCount = useMemo(
    () => pageCodes.filter((c) => selected.includes(c)).length,
    [pageCodes, selected]
  );

  const headerCheckedState: boolean | "indeterminate" = useMemo(() => {
    if (pageSlice.length === 0) return false;
    if (selectedOnPageCount === 0) return false;
    if (selectedOnPageCount === pageSlice.length) return true;
    return "indeterminate";
  }, [pageSlice.length, selectedOnPageCount]);

  const toggleSelectAllOnPage = useCallback(
    (nextChecked: boolean) => {
      setSelected((prev) => {
        if (nextChecked) {
          // add all codes on this page
          const set = new Set(prev);
          pageCodes.forEach((c) => set.add(c));
          return Array.from(set);
        } else {
          // remove all codes on this page
          return prev.filter((c) => !pageCodes.includes(c));
        }
      });
    },
    [pageCodes, setSelected]
  );

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto">
        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="bg-card rounded-lg overflow-hidden relative">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-2 p-3 border-b">
              <div className="text-sm font-medium px-1">Add new Currencies</div>
              <div className="flex items-center gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="h-9 w-[220px]"
                />
                <Select
                  value={String(rowsPerPage)}
                  onValueChange={(v) => setRowsPerPage(Number(v))}
                >
                  <SelectTrigger className="h-9 w-[120px]">
                    <SelectValue placeholder="Rows/page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 / page</SelectItem>
                    <SelectItem value="25">25 / page</SelectItem>
                    <SelectItem value="50">50 / page</SelectItem>
                    <SelectItem value="100">100 / page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px]">
                    <Checkbox
                      checked={headerCheckedState}
                      onCheckedChange={(v) => toggleSelectAllOnPage(!!v)}
                      aria-label="Select all on this page"
                      className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                    />
                  </TableHead>
                  <TableHead className="w-[140px]">Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right pr-6">
                    Tax inclusive pricing
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageSlice.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-8"
                      >
                        <div className="text-muted-foreground text-lg mb-2">
                          No currency found
                        </div>
                        <div className="text-sm text-muted-foreground/70">
                          Try adjusting your search
                        </div>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <AnimatePresence initial={false}>
                    {pageSlice.map((item) => (
                      <Row
                        key={item.code}
                        item={item}
                        isChecked={selected.includes(item.code)}
                        onCheckChange={(next) => toggleCode(item.code, next)}
                        taxInclusive={!!taxMap[item.code]}
                        onToggleTax={handleToggleTax}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between gap-3 p-3 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                {totalItems === 0
                  ? "0 results"
                  : `${startIndex + 1}–${endIndex} of ${totalItems} results`}
                {!!selected.length && (
                  <span className="text-foreground/70">
                    • Selected: {selected.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div>{`${clampedPage} of ${totalPages} pages`}</div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={clampedPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={clampedPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Optional: Debug selected codes */}
          {/* <pre className="mt-3 text-xs text-muted-foreground">{JSON.stringify(selected, null, 2)}</pre> */}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(CurrenciesTable);
