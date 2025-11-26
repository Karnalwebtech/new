"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CurrencyCode =
  | "ALL"
  | "AMD"
  | "ARS"
  | "AUD"
  | "AZN"
  | "AZNK"
  | "AZN1"
  | "AZN2"
  | "AZN3"
  | "AZN4"
  | "AZN5"
  | "BAM6";

type PriceValue = number | "";

interface PriceRow {
  id: string;
  name: string;
  prices: Record<CurrencyCode, PriceValue>;
}

// Sample row
const sampleRow: PriceRow = {
  id: "loc_01",
  name: "Main Store",
  prices: {
    ALL: 0,
    AMD: 0,
    ARS: 100,
    AUD: 0,
    AZN: 0,
    AZNK: 0,
    AZN1: 0,
    AZN2: 0,
    AZN3: 0,
    AZN4: 0,
    AZN5: 0,
    BAM6: 0,
  },
};

// Meta data for currencies (for label + symbol)
const currencyMeta: Record<CurrencyCode, { symbol: string; label: string }> = {
  ALL: { symbol: "L", label: "Albanian lek" },
  AMD: { symbol: "֏", label: "Armenian dram" },
  ARS: { symbol: "$", label: "Argentine peso" },
  AUD: { symbol: "$", label: "Australian dollar" },
  AZN: { symbol: "₼", label: "Azerbaijani manat" },
  AZNK: { symbol: "₼", label: "AZN K" },
  AZN1: { symbol: "₼", label: "AZN 1" },
  AZN2: { symbol: "₼", label: "AZN 2" },
  AZN3: { symbol: "₼", label: "AZN 3" },
  AZN4: { symbol: "₼", label: "AZN 4" },
  AZN43w: { symbol: "₼", label: "AZN 4" },
  AZN44: { symbol: "₼", label: "AZN 4" },
  AZN45: { symbol: "₼", label: "AZN 4" },
  AZN46: { symbol: "₼", label: "AZN 4" },
  AZN47: { symbol: "₼", label: "AZN 4" },
  AZN48: { symbol: "₼", label: "AZN 4" },
  AZN487: { symbol: "₼", label: "AZN 4" },
  AZN5: { symbol: "₼", label: "AZN 5" },
  BAM6: { symbol: "KM", label: "Bosnia & Herzegovina mark" },
};

export default function LocationPrices() {
  const [rows, setRows] = useState<PriceRow[]>([sampleRow]);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");

  const currencies = Object.keys(sampleRow.prices) as CurrencyCode[];

  function updatePrice(rowId: string, currency: CurrencyCode, value: string) {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;

        const parsed = parseFloat(value.replace(",", "."));

        return {
          ...row,
          prices: {
            ...row.prices,
            [currency]:
              value === ""
                ? ""
                : Number.isFinite(parsed)
                ? parsed
                : row.prices[currency],
          },
        };
      })
    );
  }

  async function handleSave() {
    try {
      setSaving(true);
      // TODO: call your API here
      await new Promise((res) => setTimeout(res, 800));
      console.log("Saved prices:", rows);
    } finally {
      setSaving(false);
    }
  }

  const visibleRows = rows.filter((r) =>
    r.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screenflex items-start justify-center w-full py-6">
      <div className="max-w-full bg-white rounded-2xl shadow-sm border">
      

        {/* Table using divs */}
        <div className="px-2 sm:px-4 pb-4">
          <div className="max-w-7xl w-full rounded-xl border bg-slate-50/60 mt-4">
            <div className="overflow-x-auto no-scrollbar">
              {/* Header row */}
              <div className="flex min-w-max border-b bg-slate-100">
                {/* Sticky Location header */}
                <div className="sticky left-0 z-20 bg-slate-100 font-semibold border-r px-4 py-3 w-[200px] text-xs uppercase text-slate-500">
                  Location
                </div>

                {currencies.map((code) => (
                  <div
                    key={code}
                    className="px-4 py-3 text-center whitespace-nowrap font-semibold min-w-[150px] text-xs uppercase text-slate-500"
                  >
                    Price {code}
                    <div className="text-[10px] text-slate-400 font-normal">
                      {currencyMeta[code]?.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Body rows */}
              {visibleRows.length === 0 ? (
                <div className="flex min-w-max">
                  <div className="px-4 py-6 text-sm text-muted-foreground">
                    No locations found.
                  </div>
                </div>
              ) : (
                visibleRows.map((row, rowIdx) => (
                  <div
                    key={row.id}
                    className={`flex min-w-max border-b ${
                      rowIdx % 2 === 1 ? "bg-slate-50/70" : "bg-white"
                    } hover:bg-slate-50 transition-colors`}
                  >
                    {/* Sticky Location cell */}
                    <div className="sticky left-0 z-20 bg-inherit font-medium border-r px-4 py-3 w-[200px] whitespace-nowrap">
                      {row.name}
                    </div>

                    {/* Price cells */}
                    {currencies.map((currency) => (
                      <div
                        key={currency}
                        className="px-4 py-3 min-w-[150px] flex items-center justify-center gap-2"
                      >
                        <span className="text-xs text-slate-500">
                          {currencyMeta[currency]?.symbol ?? "¤"}
                        </span>
                        <Input
                          inputMode="decimal"
                          className="w-24 h-8 text-right text-xs sm:text-sm"
                          value={
                            row.prices[currency] === ""
                              ? ""
                              : String(row.prices[currency])
                          }
                          placeholder="0.00"
                          onChange={(e) =>
                            updatePrice(row.id, currency, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="text-xs mt-3 text-muted-foreground">
            Tip: You can leave a field empty to use the default price from your
            main currency.
          </p>
        </div>
      </div>
    </div>
  );
}
