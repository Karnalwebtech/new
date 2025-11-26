"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

// --------------------
// 50 Currency Codes
// --------------------
type CurrencyCode =
  | "CUR1"
  | "CUR2"
  | "CUR3"
  | "CUR4"
  | "CUR5"
  | "CUR6"
  | "CUR7"
  | "CUR8"
  | "CUR9"
  | "CUR10"
  | "CUR11"
  | "CUR12"
  | "CUR13"
  | "CUR14"
  | "CUR15"
  | "CUR16"
  | "CUR17"
  | "CUR18"
  | "CUR19"
  | "CUR20"
  | "CUR21"
  | "CUR22"
  | "CUR23"
  | "CUR24"
  | "CUR25"
  | "CUR26"
  | "CUR27"
  | "CUR28"
  | "CUR29"
  | "CUR30"
  | "CUR31"
  | "CUR32"
  | "CUR33"
  | "CUR34"
  | "CUR35"
  | "CUR36"
  | "CUR37"
  | "CUR38"
  | "CUR39"
  | "CUR40"
  | "CUR41"
  | "CUR42"
  | "CUR43"
  | "CUR44"
  | "CUR45"
  | "CUR46"
  | "CUR47"
  | "CUR48"
  | "CUR49"
  | "CUR50"

type PriceValue = number | ""

interface PriceRow {
  id: string
  name: string
  prices: Record<CurrencyCode, PriceValue>
}

// --------------------
// 50 CUR CURRENCIES
// --------------------
const emptyPrices: Record<CurrencyCode, number> = {
  CUR1: 50,
  CUR2: 50,
  CUR3: 50,
  CUR4: 50,
  CUR5: 50,
  CUR6: 50,
  CUR7: 50,
  CUR8: 50,
  CUR9: 50,
  CUR10: 50,
  CUR11: 50,
  CUR12: 50,
  CUR13: 50,
  CUR14: 50,
  CUR15: 50,
  CUR16: 50,
  CUR17: 50,
  CUR18: 50,
  CUR19: 50,
  CUR20: 50,
  CUR21: 50,
  CUR22: 50,
  CUR23: 50,
  CUR24: 50,
  CUR25: 50,
  CUR26: 50,
  CUR27: 50,
  CUR28: 50,
  CUR29: 50,
  CUR30: 50,
  CUR31: 50,
  CUR32: 50,
  CUR33: 50,
  CUR34: 50,
  CUR35: 50,
  CUR36: 50,
  CUR37: 50,
  CUR38: 50,
  CUR39: 50,
  CUR40: 50,
  CUR41: 50,
  CUR42: 50,
  CUR43: 50,
  CUR44: 50,
  CUR45: 50,
  CUR46: 50,
  CUR47: 50,
  CUR48: 50,
  CUR49: 50,
  CUR50: 50,
}

// For displaying labels
const currencyMeta: Record<CurrencyCode, { symbol: string; label: string }> = Object.fromEntries(
  Object.keys(emptyPrices).map((c) => [c, { symbol: "$", label: `Currency ${c}` }]),
) as any

export default function () {
  const [rows, setRows] = useState<PriceRow[]>([
    { id: "loc_01", name: "Main Store", prices: emptyPrices },
  ])

  const currencies = Object.keys(emptyPrices) as CurrencyCode[]

  function updatePrice(id: string, currency: CurrencyCode, value: string) {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row

        const parsed = Number.parseFloat(value.replace(",", "."))

        return {
          ...row,
          prices: {
            ...row.prices,
            [currency]: value === "" ? "" : Number.isFinite(parsed) ? parsed : row.prices[currency],
          },
        }
      }),
    )
  }

  function addRow() {
    const newId = `loc_${Date.now()}`
    setRows((prev) => [...prev, { id: newId, name: `Location ${prev.length + 1}`, prices: emptyPrices }])
  }

  function deleteRow(id: string) {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* Main Frame */}
      <div className="max-w-[500px] md:max-w-[800px] lg:max-w-[1560px] w-full m-auto">
        <div className="bg-white rounded-lg border border-slate-200 shadow-md overflow-hidden">
          {/* Scrollable Table with Custom Scrollbar */}
          <div
            className="overflow-x-auto overflow-y-hidden"
            style={{
              scrollbarWidth: "auto",
              scrollBehavior: "smooth",
            }}
          >
            <div className="min-w-max">
              {/* HEADER */}
              <div className="flex border-b bg-slate-100">
                <div className="sticky left-0 z-20 bg-slate-100 px-6 py-4 w-[150px] border-r text-xs font-semibold uppercase text-slate-600 flex items-center justify-between">
                  <span>Location</span>
                </div>

                {currencies.map((code) => (
                  <div
                    key={code}
                    className="px-4 py-4 min-w-[160px] whitespace-nowrap text-center text-xs font-semibold uppercase text-slate-600 border-r border-slate-200"
                  >
                    <div>{code}</div>
                    <div className="text-[10px] text-slate-400 font-normal mt-1">{currencyMeta[code].label}</div>
                  </div>
                ))}
              </div>

              {/* ROWS */}
              {rows.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-slate-500">
                  <p>No locations added yet. Click "Add Location" to get started.</p>
                </div>
              ) : (
                rows.map((row, index) => (
                  <div
                    key={row.id}
                    className={`flex border-b transition-colors hover:bg-blue-50 ${index % 2 ? "bg-slate-50" : "bg-white"
                      }`}
                  >
                    <div className="sticky left-0 z-20 bg-inherit px-6 py-4 w-[150px] border-r font-medium text-slate-900 flex items-center justify-between group">
                      <span>{row.name}</span>

                    </div>

                    {currencies.map((currency) => (
                      <div
                        key={currency}
                        className="px-4 py-4 min-w-[160px] flex items-center justify-center gap-2 border-r border-slate-200"
                      >
                        <span className="text-xs text-slate-500">{currencyMeta[currency].symbol}</span>

                        <Input
                          className="w-28 h-9 text-right text-sm border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          inputMode="decimal"
                          placeholder="0.00"
                          value={row.prices[currency] === "" ? "" : String(row.prices[currency])}
                          onChange={(e) => updatePrice(row.id, currency, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
            <p className="text-xs text-slate-600">
              💡 Tip: Leave a field empty to use the default price. Hover over location names to delete them.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
