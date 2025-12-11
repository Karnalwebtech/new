"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Landmark } from "lucide-react";
import clsx from "clsx";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAllStoreCurrenciesQuery } from "@/state/store-currency-api";
import { getCurrencySymbol } from "@/services/currency";
import { StoreCurrenciesType } from "@/types/store-currincies-type";
import { ProductOption } from "@/modules/main/products/create/variants/variants";

type PriceValue = number | "";
export interface PriceRow {
  id: string;
  name: string;

  title: string;
  sku: string;
  managed_inventory: boolean;
  allow_backorder: boolean;
  has_inventory_kit: boolean;

  prices: Record<string, PriceValue>;
}

const FIELDS = [
  { key: "title", name: "Title", field: "text" },
  { key: "sku", name: "SKU", field: "text" },
  { key: "managed_inventory", name: "Managed Inventory", field: "checkbox" },
  { key: "allow_backorder", name: "Allow Backorder", field: "checkbox" },
  { key: "has_inventory_kit", name: "Has Inventory Kit", field: "checkbox" },
];

/* ---------------------------------------------------------
   GENERATE ALL COMBINATIONS OF PRODUCT OPTION VALUES
----------------------------------------------------------*/
function generateCombinations(options: ProductOption[]) {
  if (!options.length) return [];

  const values = options.map((opt) => opt.values);

  const combine = (arr: string[][], prefix: string[] = []): string[][] => {
    if (!arr.length) return [prefix];
    const [first, ...rest] = arr;

    return first.flatMap((v) => combine(rest, [...prefix, v]));
  };

  return combine(values);
}

/* ---------------------------------------------------------
   CURRENCY PRICE CELL
----------------------------------------------------------*/
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
        <span className="text-xs text-slate-500">
          {getCurrencySymbol(currency.code)}
        </span>

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

/* ---------------------------------------------------------
   TABLE ROW
----------------------------------------------------------*/
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

        {/* Dynamic fields */}
        {FIELDS.map((item) => (
          <div
            key={item.key}
            className="px-4 py-[4px] min-w-[200px] text-center text-xs font-semibold uppercase text-slate-600 border-r"
          >
            {item.field === "text" ? (
              <Input
                className="w-[160px] text-right text-sm"
                value={(row as any)[item.key] ?? ""}
                onChange={(e) =>
                  onFieldChange(row.id, item.key, e.target.value)
                }
              />
            ) : (
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={Boolean((row as any)[item.key])}
                  onCheckedChange={(checked) =>
                    onFieldChange(row.id, item.key, Boolean(checked))
                  }
                />
              </div>
            )}
          </div>
        ))}

        {/* Price cells */}
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

/* ---------------------------------------------------------
   MAIN COMPONENT
----------------------------------------------------------*/
export default function VariantPriceEditor({
  rows,
  setRows,
  productOptions,
}: {
  rows: PriceRow[];
  setRows: React.Dispatch<React.SetStateAction<PriceRow[]>>;
  productOptions: ProductOption[];
}) {
  const { data, isLoading, error } = useGetAllStoreCurrenciesQuery({
    rowsPerPage: 100,
    page: 1,
  });

  /* Load currencies */
  const currencies = useMemo(() => {
    return (data?.result || [])
      .map((c: StoreCurrenciesType) => {
        const code = c?.currency_id?.code || "";
        const key = c?.id || c?._id || code;
        const label = c?.currency_id?.name || code;

        return { raw: c, key, code, label };
      })
      .filter((c) => !!c.code);
  }, [data?.result]);

  /* Empty initial prices per currency */
  const emptyPrices = useMemo(() => {
    const map: Record<string, PriceValue> = {};
    currencies.forEach((c) => (map[c.code] = ""));
    return map;
  }, [currencies]);

  /* ---------------------------------------------------------
     AUTO GENERATE VARIANT ROWS FROM PRODUCT OPTIONS (Option A)
  ----------------------------------------------------------*/
  useEffect(() => {
    if (!productOptions.length || !currencies.length) return;

    const combos = generateCombinations(productOptions);

    setRows((prevRows) => {
      const existingIds = prevRows.map((r) => r.id);
      const newRows = combos.map((combo, index) => {
        const id = `variant_${index}`;
        const existing = prevRows.find((r) => r.id === id);
        return existing
          ? existing // keep user data
          : {
              id,
              name: combo.join(" / "),
              title: combo.join(" / "),
              sku: "",
              managed_inventory: false,
              allow_backorder: false,
              has_inventory_kit: false,
              prices: { ...emptyPrices },
            };
      });
      return newRows;
    });
  }, [productOptions, currencies]);

  /* Update price */
  const updatePrice = useCallback(
    (rowId: string, currencyCode: string, value: string) => {
      const cleaned = value.replace(",", ".");
      const parsed = cleaned === "" ? "" : Number.parseFloat(cleaned);

      const finalVal: PriceValue =
        cleaned === ""
          ? ""
          : Number.isFinite(parsed)
          ? parsed
          : rows.find((r) => r.id === rowId)?.prices[currencyCode] ?? "";

      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? { ...row, prices: { ...row.prices, [currencyCode]: finalVal } }
            : row
        )
      );
    },
    [rows, setRows]
  );

  /* Update text/checkbox field */
  const updateField = useCallback(
    (rowId: string, key: string, value: any) => {
      setRows((prev) =>
        prev.map((row) => (row.id === rowId ? { ...row, [key]: value } : row))
      );
    },
    [setRows]
  );

  if (isLoading) return <div className="p-6">Loading currencies…</div>;
  if (error)
    return <div className="p-6 text-red-600">Failed to load currencies</div>;

  return (
    <div className="fixed inset-0 flex items-center justify-center pt-20">
      <div className="flex flex-col w-full h-full max-h-[96vh] max-w-[98vw] bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex-1 w-full overflow-x-auto overflow-y-hidden">
          <div className="w-max min-w-[1200px]">
            {/* Header */}
            <div className="flex sticky top-0 bg-white z-20 border-b">
              <div className="sticky left-0 z-30 bg-white px-6 py-3 w-[220px] border-r">
                <div className="text-xs font-semibold uppercase text-slate-600">
                  Variant
                </div>
              </div>

              {FIELDS.map((item) => (
                <div
                  key={item.key}
                  className="px-4 py-3 min-w-[200px] text-center text-xs font-semibold uppercase text-slate-600 border-r"
                >
                  {item.name}
                </div>
              ))}

              {currencies.map((currency) => (
                <div
                  key={currency.key}
                  className="px-4 py-3 min-w-[200px] border-r text-xs font-semibold uppercase text-slate-600"
                >
                  <div className="flex items-center justify-between">
                    <span>Price {currency.code}</span>
                    <Landmark size={14} />
                  </div>
                </div>
              ))}
            </div>

            {/* DATA ROWS */}
            {rows.map((row, i) => (
              <PriceTableRow
                key={row.id}
                row={row}
                rowIndex={i}
                currencies={currencies}
                onPriceUpdate={updatePrice}
                onFieldChange={updateField}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
