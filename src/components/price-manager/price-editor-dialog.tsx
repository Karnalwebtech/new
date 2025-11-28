"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Landmark, Maximize2 } from "lucide-react";
import clsx from "clsx";
import { useGetAllStoreCurrenciesQuery } from "@/state/store-currency-api";
import { formatNumberUniversal, getCurrencySymbol } from "@/services/currency";
import { StoreCurrenciesType } from "@/types/store-currincies-type";
import PriceManagerDialog from "./price-manager-dialog";

type PriceValue = number | "";
interface PriceRow {
  id: string;
  name: string;
  prices: Record<string, PriceValue>;
}

// Memoized currency formatter to prevent recreation on every render
const useCurrencyFormatter = () => {
  return useCallback((value: number, currencyCode: string) => {
    return formatNumberUniversal(value, currencyCode);
  }, []);
};

// Optimized currency row component to prevent unnecessary re-renders
const CurrencyPriceCell = React.memo(
  ({
    currency,
    rowId,
    priceValue,
    onPriceUpdate,
  }: {
    currency: { code: string; key: string };
    rowId: string;
    priceValue: PriceValue;
    onPriceUpdate: (rowId: string, currencyCode: string, value: string) => void;
  }) => {
    const formatCurrency = useCurrencyFormatter();

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onPriceUpdate(rowId, currency.code, e.target.value);
      },
      [rowId, currency.code, onPriceUpdate]
    );

    const handleBlur = useCallback(() => {
      if (priceValue !== "" && !isNaN(Number(priceValue))) {
        const formatted = formatCurrency(Number(priceValue), currency.code);
        onPriceUpdate(rowId, currency.code, formatted);
      }
    }, [priceValue, currency.code, rowId, onPriceUpdate, formatCurrency]);

    return (
      <>
      <div className="min-w-[200px] px-3 flex items-center justify-between gap-2 border-r">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {getCurrencySymbol(currency.code)}
          </span>
          <button
            className="cursor-pointer"
            onClick={() => console.log("click")}
          >
            <Maximize2 size={14} className="text-slate-400" />
          </button>
        </div>
        <Input
          className="w-28 text-right text-sm"
          inputMode="decimal"
          placeholder="0"
          value={priceValue === "" ? "0" : String(priceValue)}
          onChange={handleChange}
          // onBlur={handleBlur}
        />
      </div>
      <PriceManagerDialog
      
      />
      </>
    );
  }
);

CurrencyPriceCell.displayName = "CurrencyPriceCell";

// Optimized table row component
const PriceTableRow = React.memo(
  ({
    row,
    rowIndex,
    currencies,
    onPriceUpdate,
  }: {
    row: PriceRow;
    rowIndex: number;
    currencies: Array<{ code: string; key: string; label: string }>;
    onPriceUpdate: (rowId: string, currencyCode: string, value: string) => void;
  }) => {
    return (
      <div
        className={clsx(
          "flex items-center border-b",
          rowIndex % 2 ? "bg-slate-50" : "bg-white"
        )}
      >
        <div className="sticky left-0 z-10 bg-inherit px-6 py-2 w-[220px] border-r">
          <div className="text-sm font-medium">{row.name}</div>
        </div>

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

// Main component
export default function FullscreenPriceEditor() {
  const { data, isLoading, error } = useGetAllStoreCurrenciesQuery({
    rowsPerPage: 100,
    page: 1,
  });

  // Optimized currency derivation with proper dependency array
  const currencies = useMemo(() => {
    return (data?.result || []).map((c: StoreCurrenciesType) => {
      const code = c?.currency_id?.code || "";
      const key =
        c?.id || c?._id || code || Math.random().toString(36).slice(2);
      const label = c?.currency_id?.name || code;
      return { raw: c, key, code, label };
    });
  }, [data?.result]);

  // Memoized empty prices object
  const emptyPricesForCurrencies = useMemo(() => {
    const map: Record<string, PriceValue> = {};
    currencies.forEach((c) => (map[c.code] = ""));
    return map;
  }, [currencies]);

  const [rows, setRows] = useState<PriceRow[]>([]);

  // Optimized initial rows setup
  useEffect(() => {
    if (currencies.length > 0 && rows.length === 0) {
      setRows([
        {
          id: "loc_main",
          name: "Main Store",
          prices: { ...emptyPricesForCurrencies },
        },
      ]);
    }
  }, [currencies.length, rows.length, emptyPricesForCurrencies]);

  // Memoized price update handler
  const updatePrice = useCallback(
    (rowId: string, currencyCode: string, value: string) => {
      setRows((prev) =>
        prev.map((row) => {
          if (row.id !== rowId) return row;

          const parsed = Number.parseFloat(value.replace(",", "."));
          const newVal: PriceValue =
            value === ""
              ? ""
              : Number.isFinite(parsed)
              ? parsed
              : row.prices[currencyCode];

          return {
            ...row,
            prices: { ...row.prices, [currencyCode]: newVal },
          };
        })
      );
    },
    []
  );

  // Loading and error states
  if (isLoading) return <div className="p-6">Loading currencies…</div>;
  if (error)
    return <div className="p-6 text-red-600">Failed to load currencies</div>;

  return (
    <div className="fixed inset-0 flex items-center justify-center pt-20">
      <div className="flex flex-col w-full h-full max-h-[96vh] max-w-[98vw] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[900px] md:min-w-[1200px] lg:min-w-[1600px]">
            {/* Header row */}
            <div className="flex sticky top-0 bg-white z-20 border-b">
              <div className="sticky left-0 z-30 bg-white px-6 py-3 w-[220px] border-r">
                <div className="text-xs font-semibold uppercase text-slate-600">
                  Location
                </div>
              </div>

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
              <div className="py-12 text-center text-slate-500">
                No locations. Add one to get started.
              </div>
            ) : (
              rows.map((row, rowIndex) => (
                <PriceTableRow
                  key={row.id}
                  row={row}
                  rowIndex={rowIndex}
                  currencies={currencies}
                  onPriceUpdate={updatePrice}
                />
              ))
            )}
          </div>
          <div className="text-xs text-slate-600">
            Tip: leave blank to use default price.
          </div>
        </div>
      </div>
    </div>
  );
}
