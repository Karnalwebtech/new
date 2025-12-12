"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Landmark } from "lucide-react";
import clsx from "clsx";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetAllStoreCurrenciesQuery } from "@/state/store-currency-api";
import { getCurrencySymbol } from "@/services/currency";
import { StoreCurrenciesType } from "@/types/store-currincies-type";
import { ProductOption } from "@/modules/main/products/create/variants/variants";

/* ---------------------------
   Types
----------------------------*/
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
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

/* ---------------------------
   Helpers
----------------------------*/

/** Generate all combinations of option values.
 *  Example: [{values: ["S","M"]}, {values: ["Red","Blue"]}] -> [["S","Red"],["S","Blue"],["M","Red"],["M","Blue"]]
 */
function generateCombinations(options: ProductOption[]): string[][] {
  if (!options.length) return [];

  const values: string[][] = options.map((opt) => opt.values ?? []);

  const combine = (arr: string[][], prefix: string[] = []): string[][] => {
    if (arr.length === 0) return [prefix];
    const [first, ...rest] = arr;
    return first.flatMap((v) => combine(rest, [...prefix, v]));
  };

  return combine(values);
}

/* ---------------------------
   Currency cell
----------------------------*/
type CurrencyCellProps = {
  currency: { code: string; key: string; label: string };
  rowId: string;
  priceValue: PriceValue;
  onPriceUpdate: (rowId: string, currencyCode: string, value: string) => void;
};

const CurrencyPriceCell = React.memo(function CurrencyPriceCell({
  currency,
  rowId,
  priceValue,
  onPriceUpdate,
}: CurrencyCellProps) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onPriceUpdate(rowId, currency.code, e.target.value);
  };

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
});

CurrencyPriceCell.displayName = "CurrencyPriceCell";

/* ---------------------------
   Row component
----------------------------*/
type CurrencyMeta = {
  raw: StoreCurrenciesType;
  key: string;
  code: string;
  label: string;
};

type PriceTableRowProps = {
  row: PriceRow;
  rowIndex: number;
  currencies: CurrencyMeta[];
  onPriceUpdate: (rowId: string, currencyCode: string, value: string) => void;
  onFieldChange: (
    rowId: string,
    key: FieldKey,
    value: string | boolean
  ) => void;
};

const PriceTableRow = React.memo(function PriceTableRow({
  row,
  rowIndex,
  currencies,
  onPriceUpdate,
  onFieldChange,
}: PriceTableRowProps) {
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
              value={row[item.key as keyof PriceRow] as string}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onFieldChange(row.id, item.key, e.target.value)
              }
            />
          ) : (
            <div className="flex items-center justify-center">
              <Checkbox
                checked={Boolean(row[item.key as keyof PriceRow])}
                onCheckedChange={(checked: boolean | "indeterminate") =>
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
});

PriceTableRow.displayName = "PriceTableRow";

/* ---------------------------
   Main component
----------------------------*/
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

  /* Load currencies (strongly typed) */
  const currencies = useMemo<CurrencyMeta[]>(() => {
    const list = (data?.result || []) as StoreCurrenciesType[];
    return list
      .map((c) => {
        const code = c?.currency_id?.code ?? "";
        const key = c?.id ?? c?._id ?? code; // external API shapes vary; keep stable key
        const label = c?.currency_id?.name ?? code;
        return { raw: c, key, code, label };
      })
      .filter((c) => c.code.length > 0);
  }, [data?.result]);

  /* Empty initial prices per currency */
  const emptyPrices = useMemo<Record<string, PriceValue>>(() => {
    const map: Record<string, PriceValue> = {};
    currencies.forEach((c) => {
      map[c.code] = "";
    });
    return map;
  }, [currencies]);

  /* Auto-generate variant rows from product options */
  useEffect(() => {
    if (!productOptions.length || !currencies.length) return;
    const combos = generateCombinations(productOptions);

    setRows((prevRows) => {
      // Build stable ids using index + combo values so new order won't accidentally reuse wrong id
      const newRows = combos.map((combo, index) => {
        const id = `variant_${index}_${combo.join("_")}`;
        const existing = prevRows.find((r) => r.id === id);
        return (
          existing ?? {
            id,
            name: combo.join(" / "),
            title: combo.join(" / "),
            sku: "",
            managed_inventory: false,
            allow_backorder: false,
            has_inventory_kit: false,
            prices: { ...emptyPrices },
            // product_option_id: productOptions.map((item) => item.id).join("_"),
          }
        );
      });

      return newRows;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productOptions, currencies.length]);

  /* Update price */
  const updatePrice = useCallback(
    (rowId: string, currencyCode: string, value: string) => {
      const cleaned = value.replace(",", ".").trim();
      const parsed = cleaned === "" ? "" : Number.parseFloat(cleaned);

      const finalVal: PriceValue =
        cleaned === ""
          ? ""
          : Number.isFinite(parsed)
          ? parsed
          : // keep existing price if parsing fails
            rows.find((r) => r.id === rowId)?.prices[currencyCode] ?? "";

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
    (rowId: string, key: FieldKey, value: string | boolean) => {
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
        <div className="flex-1 w-full overflow-scroll pb-[100px]">
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

            {/* Data rows */}
            {/* <div className="overflow-y-auto max-h-[500px]"> */}
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
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
