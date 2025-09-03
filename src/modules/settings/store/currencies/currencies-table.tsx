"use client";

import React, { memo, useMemo, useState, useCallback } from "react";
import currencyCodes from "currency-codes";
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

// optional helpers you already have
import { TruncateText } from "@/components/truncate-text";
import useWindowWidth from "@/hooks/useWindowWidth";
import { containerVariants } from "@/lib/variants";
import { Checkbox } from "@/components/ui/checkbox";

// ---- Row (animated) ---------------------------------------------------------

type CurrencyItem = {
  code: string;
  name: string;
  countries?: string[];
};

const Row = memo(function Row({
  item,
  taxInclusive,
  onToggle,
  currencyHandler,
}: {
  item: CurrencyItem;
  taxInclusive: boolean;
  onToggle: (code: string, next: boolean) => void;
  currencyHandler: (item: CurrencyItem) => void;
}) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="group hover:bg-muted/40 transition-colors"
    >
      <TableCell className="w-[140px]">
        <span className="text-muted-foreground">
          <Checkbox
            onCheckedChange={() => currencyHandler(item)}
            id="toggle-2"
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
          />
        </span>
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
          onCheckedChange={(v) => onToggle(item.code, v)}
          aria-label={`Toggle tax inclusive pricing for ${item.code}`}
        />
      </TableCell>
    </motion.tr>
  );
});

// ---- Main -------------------------------------------------------------------

const CurrenciesTable = () => {
  const width = useWindowWidth();
  const [selected, setSelected] = useState<CurrencyItem[]>([]);
  console.log(selected);
  // source data (normalize once)
  const allCurrencies: CurrencyItem[] = useMemo(
    () =>
      (currencyCodes?.data ?? []).map((c) => ({
        code: c.code,
        name: c.currency,
        countries: c.countries,
      })),
    []
  );
  // search
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    if (!query.trim()) return allCurrencies;
    const q = query.trim().toLowerCase();
    return allCurrencies.filter(
      (x) =>
        x.code.toLowerCase().includes(q) ||
        x.name.toLowerCase().includes(q) ||
        (x.countries?.some((cty) => cty.toLowerCase().includes(q)) ?? false)
    );
  }, [allCurrencies, query]);

  // pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10); // default 50 like your screenshot

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const clampedPage = Math.min(page, totalPages);
  const startIndex = (clampedPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const slice = filtered.slice(startIndex, endIndex);

  // reset to page 1 whenever search or page size changes
  React.useEffect(() => setPage(1), [query, rowsPerPage]);

  // tax inclusive state (per code)
  const [taxMap, setTaxMap] = useState<Record<string, boolean>>({
    AED: true,
    AFN: true,
  });
  const handleToggle = useCallback((code: string, next: boolean) => {
    setTaxMap((m) => ({ ...m, [code]: next }));
  }, []);

  const currencyHandler = (item: CurrencyItem, checked: boolean) => {
    setSelected((prev) => {
      if (checked) {
        // Add if not already in array
        if (!prev.find((x) => x.code === item.code)) {
          return [...prev, item];
        }
        return prev; // already exists
      } else {
        // Remove if unchecked
        return prev.filter((x) => x.code !== item.code);
      }
    });
  };
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
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
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
                  <TableHead className="w-[140px]">
                    <Checkbox
                      id="toggle-2"
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
                {slice.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
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
                    {slice.map((item) => (
                      <Row
                        key={item.code}
                        item={item}
                        taxInclusive={!!taxMap[item.code]}
                        onToggle={handleToggle}
                        currencyHandler={currencyHandler}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </TableBody>
            </Table>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between gap-3 p-3 border-t text-sm text-muted-foreground">
              <div>
                {totalItems === 0
                  ? "0 results"
                  : `${startIndex + 1}–${endIndex} of ${totalItems} results`}
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
        </div>
      </div>
    </motion.div>
  );
};

export default memo(CurrenciesTable);
