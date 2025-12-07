"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { Input } from "@/components/ui/input";
import { Landmark, Maximize2 } from "lucide-react";
import clsx from "clsx";
import { useGetAllStoreCurrenciesQuery } from "@/state/store-currency-api";
import { getCurrencySymbol } from "@/services/currency";
import { StoreCurrenciesType } from "@/types/store-currincies-type";
import PriceManagerDialog from "./price-manager-dialog";
import { Checkbox } from "@/components/ui/checkbox";

type PriceValue = number | "";
export interface PriceRow {
  id: string;
  name: string;

  // new fields stored inside the row (Option A)
  title: string;
  sku: string;
  managed_inventory: boolean;
  allow_backorder: boolean;
  has_inventory_kit: boolean;

  prices: Record<string, PriceValue>;
}

type CCValueType = { key: string; name: string };

const FIELDS = [
  { key: "title", name: "Title", field: "text" },
  { key: "sku", name: "SKU", field: "text" },
  { key: "managed_inventory", name: "Managed Inventory", field: "checkbox" },
  { key: "allow_backorder", name: "Allow Backorder", field: "checkbox" },
  { key: "has_inventory_kit", name: "Has Inventory Kit", field: "checkbox" },
];

// ---------------------------
// Currency Input Cell
// ---------------------------
const CurrencyPriceCell = React.memo(
  ({
    currency,
    rowId,
    priceValue,
    onPriceUpdate,
  }: {
    currency: { code: string; key: string; label: string };
    rowId: string;
    priceValue: PriceValue;
    onPriceUpdate: (rowId: string, currencyCode: string, value: string) => void;
  }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onPriceUpdate(rowId, currency.code, e.target.value);
      },
      [rowId, currency.code, onPriceUpdate]
    );

    return (
      <div className="min-w-[200px] px-3 flex items-center justify-between gap-2 border-r">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {getCurrencySymbol(currency.code)}
          </span>
        </div>

        <Input
          className="w-[160px] text-right text-sm"
          inputMode="decimal"
          placeholder="0"
          value={priceValue === "" ? "" : String(priceValue)}
          onChange={handleChange}
        />
      </div>
    );
  }
);

CurrencyPriceCell.displayName = "CurrencyPriceCell";

// ---------------------------
// Row Component
// ---------------------------
const PriceTableRow = React.memo(
  ({
    row,
    rowIndex,
    currencies,
    onPriceUpdate,
    onFieldChange,
  }: {
    row: PriceRow;
    rowIndex: number;
    currencies: Array<{ code: string; key: string; label: string }>;
    onPriceUpdate: (rowId: string, currencyCode: string, value: string) => void;
    onFieldChange: (rowId: string, key: string, value: any) => void;
  }) => {
    return (
      <div
        className={clsx(
          "flex items-center border-b",
          rowIndex % 2 ? "bg-slate-50" : "bg-white"
        )}
      >
        {/* Sticky first column */}
        <div className="sticky left-0 z-10 bg-inherit px-6 py-2 w-[220px] border-r">
          <div className="text-sm font-medium">{row.name}</div>
        </div>

        {/* Dynamic fields (Title, SKU, Checkboxes) */}
        {FIELDS.map((item) => (
          <div
            key={item.key}
            className="px-4 py-[4px] min-w-[200px] text-center text-xs font-semibold uppercase text-slate-600 border-r"
          >
            {item.field === "text" ? (
              <Input
                className="w-[160px] text-right text-sm"
                placeholder={item.name}
                value={(row as any)[item.key] ?? ""}
                onChange={(e) => onFieldChange(row.id, item.key, e.target.value)}
              />
            ) : (
              <div className="flex items-center justify-center">
                <Checkbox
                  id={`${row.id}-${item.key}`}
                  checked={Boolean((row as any)[item.key])}
                  onCheckedChange={(checked) =>
                    onFieldChange(row.id, item.key, Boolean(checked))
                  }
                />
              </div>
            )}
          </div>
        ))}

        {/* Currency columns */}
        {currencies.map((currency) => (
          <CurrencyPriceCell
            key={`${row.id}-${currency.key}`}
            currency={currency}
            rowId={row.id}
            priceValue={row.prices[currency.code]}
            onPriceUpdate={onPriceUpdate}
          />
        ))}
      </div>
    );
  }
);

PriceTableRow.displayName = "PriceTableRow";

// ---------------------------
// MAIN COMPONENT
// ---------------------------
export default function VariantPriceEditor({
  rows,
  setRows,
}: {
  rows: PriceRow[];
  setRows: React.Dispatch<React.SetStateAction<PriceRow[]>>;
}) {
  const { data, isLoading, error } = useGetAllStoreCurrenciesQuery({
    rowsPerPage: 100,
    page: 1,
  });

  // Build currencies list from API result
  const currencies = useMemo(() => {
    return (data?.result || [])
      .map((c: StoreCurrenciesType) => {
        const code = c?.currency_id?.code || "";
        const key = c?.id || c?._id || code || Math.random().toString(36).slice(2);
        const label = c?.currency_id?.name || code;
        return { raw: c, key, code, label };
      })
      // filter out empty currency codes if any (defensive)
      .filter((c) => !!c.code);
  }, [data?.result]);

  // prepare empty prices shape for current currencies
  const emptyPricesForCurrencies = useMemo(() => {
    const map: Record<string, PriceValue> = {};
    currencies.forEach((c) => (map[c.code] = ""));
    return map;
  }, [currencies]);

  // initialize default row if none exists
  useEffect(() => {
    if (currencies.length > 0 && rows.length === 0) {
      setRows([
        {
          id: "loc_main",
          name: "Default option value",
          title: "",
          sku: "",
          managed_inventory: false,
          allow_backorder: false,
          has_inventory_kit: false,
          prices: { ...emptyPricesForCurrencies },
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies.length]);

  // update a currency price for a given row
  const updatePrice = useCallback(
    (rowId: string, currencyCode: string, value: string) => {
      // normalize commas to dots, empty string allowed
      const cleaned = value.replace(",", ".");
      const parsed = cleaned === "" ? "" : Number.parseFloat(cleaned);
      const finalVal: PriceValue =
        cleaned === "" ? "" : Number.isFinite(parsed) ? parsed : (rows.find(r => r.id === rowId)?.prices[currencyCode] ?? "");

      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? { ...row, prices: { ...row.prices, [currencyCode]: finalVal } }
            : row
        )
      );
    },
    [setRows, rows]
  );

  // update generic field (title, sku, checkboxes)
  const updateField = useCallback(
    (rowId: string, key: string, value: any) => {
      setRows((prev) =>
        prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row))
      );
    },
    [setRows]
  );


  if (isLoading) return <div className="p-6">Loading currencies…</div>;
  if (error) return <div className="p-6 text-red-600">Failed to load currencies</div>;

  return (
    <div className="fixed inset-0 flex items-center justify-center pt-20">
      <div className="flex flex-col w-full h-full max-h-[96vh] max-w-[98vw] bg-white rounded-xl shadow-2xl overflow-hidden">

        {/* HORIZONTAL SCROLL WRAPPER */}
        <div className="flex-1 w-full overflow-x-auto overflow-y-hidden">
          <div className="w-max min-w-[900px] md:min-w-[1200px] lg:min-w-[1600px]">

            {/* Header row */}
            <div className="flex sticky top-0 bg-white z-20 border-b">
              <div className="sticky left-0 z-30 bg-white px-6 py-3 w-[220px] border-r">
                <div className="text-xs font-semibold uppercase text-slate-600">
                  Default option
                </div>
              </div>

              {FIELDS.map((item) => (
                <div
                  key={item.key}
                  className="px-4 py-3 min-w-[200px] text-center text-xs font-semibold uppercase text-slate-600 border-r"
                >
                  <span>{item.name}</span>
                </div>
              ))}

              {currencies.map((currency) => (
                <div
                  key={currency.key}
                  className="px-4 py-3 min-w-[200px] text-center text-xs font-semibold uppercase text-slate-600 border-r"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>Price {currency.code}</span>
                    <Landmark size={14} />
                  </div>
                </div>
              ))}
            </div>

            {/* Data rows */}
            {rows.length === 0 ? (
              <div className="py-12 text-center text-slate-500">No rows. Add one to get started.</div>
            ) : (
              rows.map((row, i) => (
                <PriceTableRow
                  key={row.id}
                  row={row}
                  rowIndex={i}
                  currencies={currencies}
                  onPriceUpdate={updatePrice}
                  onFieldChange={updateField}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
