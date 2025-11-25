"use client";
import { memo, useCallback, useMemo, useState } from "react";
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
import { useDebounced } from "@/hooks/useDebounced";
import {
  bulkToggleCodes,
  toggleCode,
  toggleTax,
} from "@/reducers/healper-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { TableEmptyState } from "@/components/table/table-empty-state";
import PageHeander2 from "@/modules/layout/header/page-heander2";

const Row = memo(
  ({
    item,
    onToggleTax,
    onCheckChange,
    taxInclusive,
    isChecked,
    isTaxPrice,
    isDisabled,
  }: {
    item: CurrencyItem;
    isChecked: boolean;
    index: number;
    onCheckChange: (next: boolean) => void;
    onToggleTax: (code: string, next: boolean) => void;
    taxInclusive: boolean;
    isTaxPrice: boolean;
    isDisabled: string[];
  }) => {
    return (
      <TableRow className={`group transition-colors duration-200 ${isDisabled.includes(item.code) ? "opacity-50 pointer-events-none" : "hover:bg-muted/40"
        }`}>
        <TableCell>
          <Checkbox
            disabled={isDisabled.includes(item.code)}
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
        {isTaxPrice && (
          <TableCell className="text-right pr-6">
            <Switch
              checked={taxInclusive}
              onCheckedChange={(v) => onToggleTax(item.code, v)}
              aria-label={`Toggle tax inclusive pricing for ${item.code}`}
            />
          </TableCell>
        )}
      </TableRow>
    );
  }
);
Row.displayName = "Row";
interface CurrenciesTableProps {
  isTaxPrice?: boolean;
}
const CurrenciesTable = ({ isTaxPrice = true }: CurrenciesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("20");
  const [search, setSearch] = useState<string>("");
  const dispatch = useDispatch();
  const { taxMap, selected, isDisabled } = useSelector((state: RootState) => state.helper);

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
      // if (!setTaxMap) return;
      // setTaxMap((prev) => {
      //   if (prev[code] === next) return prev;
      //   return { ...prev, [code]: next };
      // });
      dispatch(toggleTax({ code: code, checked: next }));
    },
    [dispatch]
  );

  const handleToggleCode = useCallback(
    (code: string, checked: boolean) => {
      // if (!setSelected) return;
      // setSelected((prev) => {
      //   if (checked) {
      //     return prev.includes(code) ? prev : [...prev, code];
      //   }
      //   return prev.filter((c) => c !== code);
      // });
      dispatch(toggleCode({ code, checked }));
    },
    [dispatch]
  );
  const selectedOnPageCount = useMemo(() => {
    if (!selected) return 0;
    return result.filter((c) => selected.includes(c.code)).length;
  }, [result, selected]);

  const headerCheckedState: boolean | "indeterminate" = useMemo(() => {
    if (filteredItems.length === 0) return false;
    if (selectedOnPageCount === 0) return false;
    if (selectedOnPageCount === filteredItems.length) return true;
    return "indeterminate";
  }, [filteredItems.length, selectedOnPageCount]);

  const tableBody = useMemo(() => {
    if (!filteredItems.length) {
      return <TableEmptyState colSpan={1} />;
    }

    return filteredItems.map((item, i) => (
      <Row
        key={`${item._id || item.code}-${i}`}
        item={item}
        index={i}
        onToggleTax={handleToggleTax}
        isChecked={Array.isArray(selected) && selected.includes(item.code) || isDisabled.includes(item.code)}
        onCheckChange={(next) => handleToggleCode(item.code, next)}
        taxInclusive={taxMap?.[item.code] ?? false}
        isTaxPrice={isTaxPrice}
        isDisabled={isDisabled}
      />
    ));
  }, [
    filteredItems,
    handleToggleTax,
    handleToggleCode,
    isTaxPrice,
    taxMap,
    selected,
  ]);

  const toggleSelectAllOnPage = useCallback(
    (nextChecked: boolean) => {
      // setSelected((prev) => {
      //   if (nextChecked) {
      //     // add all codes on this page
      //     const set = new Set(prev);
      //     result.forEach((c) => set.add(c?.code));
      //     return Array.from(set);
      //   } else {
      //     // remove all codes on this page
      //     return [];
      //   }
      // });
      dispatch(
        bulkToggleCodes({
          codes: result.map((c) => c.code),
          checked: nextChecked,
        })
      );
    },
    [dispatch, result]
  );

  return (
    <div className="min-h-screen bg-background mb-14">
      <div className="container mx-auto pb-8">
        <PageHeander2
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          searchTerm={search}
          setSearchTerm={setSearch}
          is_btn={false}
        />
        <div
          style={{ width: width < 749 ? `${width}px` : "100%" }}
          className="min-h-[400px] px-2"
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm relative">
            <Shadcn_table
              table_header={
                isTaxPrice
                  ? ["checkbox", "Code", "Name", "Tax inclusive pricing"]
                  : ["checkbox", "Code", "Name"]
              }
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
