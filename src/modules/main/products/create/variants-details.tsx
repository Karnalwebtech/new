"use client"

import { useMemo, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

type VariantRow = {
  id: string
  option: string
  title: string
  sku: string
  managedInventory: boolean
  allowBackorder: boolean
  hasInventoryKit: boolean
  priceINR: string
  priceIndia: string
}

const initialRows: VariantRow[] = [
  {
    id: "1",
    option: "luckkk / sun",
    title: "sas / mun",
    sku: "sas / mun",
    managedInventory: true,
    allowBackorder: true,
    hasInventoryKit: true,
    priceINR: "",
    priceIndia: "",
  },
  {
    id: "2",
    option: "aaaa / mun",
    title: "aaaa / mun",
    sku: "aaaa / mun",
    managedInventory: false,
    allowBackorder: false,
    hasInventoryKit: false,
    priceINR: "",
    priceIndia: "",
  },
  {
    id: "3",
    option: "sas / moon",
    title: "sas / moon",
    sku: "sas / moon",
    managedInventory: false,
    allowBackorder: false,
    hasInventoryKit: false,
    priceINR: "",
    priceIndia: "",
  },
  {
    id: "4",
    option: "aaaa / moon",
    title: "aaaa / moon",
    sku: "aaaa / moon",
    managedInventory: false,
    allowBackorder: false,
    hasInventoryKit: false,
    priceINR: "",
    priceIndia: "",
  },
  {
    id: "5",
    option: "sas / soon",
    title: "sas / soon",
    sku: "sas / soon",
    managedInventory: false,
    allowBackorder: false,
    hasInventoryKit: false,
    priceINR: "",
    priceIndia: "",
  },
  {
    id: "6",
    option: "aaaa / soon",
    title: "aaaa / soon",
    sku: "aaaa / soon",
    managedInventory: false,
    allowBackorder: false,
    hasInventoryKit: false,
    priceINR: "",
    priceIndia: "",
  },
]

const VariantsDetails = () =>  {
  const [rows, setRows] = useState<VariantRow[]>(initialRows)

  const headers = useMemo(
    () => [
      { key: "option", label: "luckkk / sun" },
      { key: "title", label: "Title" },
      { key: "sku", label: "SKU" },
      { key: "managedInventory", label: "Managed inventory" },
      { key: "allowBackorder", label: "Allow backorder" },
      { key: "hasInventoryKit", label: "Has inventory kit" },
      { key: "priceINR", label: "Price INR" },
      { key: "priceIndia", label: "Price India" },
    ],
    [],
  )

  function toggle(id: string, field: keyof VariantRow, value: boolean) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function edit(id: string, field: keyof VariantRow, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted sticky top-0 z-10">
          <tr className="border-b">
            {headers.map((h) => (
              <th key={h.key} scope="col" className="whitespace-nowrap px-3 py-2 text-left font-medium text-foreground">
                {h.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id} className="border-b last:border-0 hover:bg-muted/40">
              {/* Option */}
              <td className="px-3 py-2 align-middle">{row.option}</td>

              {/* Title */}
              <td className="px-3 py-2 align-middle">
                <Input
                  aria-label={`Title row ${i + 1}`}
                  value={row.title}
                  onChange={(e) => edit(row.id, "title", e.target.value)}
                  className="h-8"
                />
              </td>

              {/* SKU */}
              <td className="px-3 py-2 align-middle">
                <Input
                  aria-label={`SKU row ${i + 1}`}
                  value={row.sku}
                  onChange={(e) => edit(row.id, "sku", e.target.value)}
                  className="h-8"
                />
              </td>

              {/* Managed inventory */}
              <td className="px-3 py-2 align-middle">
                <Checkbox
                  checked={row.managedInventory}
                  onCheckedChange={(v) => toggle(row.id, "managedInventory", Boolean(v))}
                  aria-label={`Managed inventory row ${i + 1}`}
                />
              </td>

              {/* Allow backorder */}
              <td className="px-3 py-2 align-middle">
                <Checkbox
                  checked={row.allowBackorder}
                  onCheckedChange={(v) => toggle(row.id, "allowBackorder", Boolean(v))}
                  aria-label={`Allow backorder row ${i + 1}`}
                />
              </td>

              {/* Has inventory kit */}
              <td className="px-3 py-2 align-middle">
                <Checkbox
                  checked={row.hasInventoryKit}
                  onCheckedChange={(v) => toggle(row.id, "hasInventoryKit", Boolean(v))}
                  aria-label={`Has inventory kit row ${i + 1}`}
                />
              </td>

              {/* Price INR */}
              <td className="px-3 py-2 align-middle">
                <div className="flex items-center gap-1">
                  <span aria-hidden>₹</span>
                  <Input
                    inputMode="decimal"
                    aria-label={`Price INR row ${i + 1}`}
                    value={row.priceINR}
                    onChange={(e) => edit(row.id, "priceINR", e.target.value)}
                    className="h-8"
                  />
                </div>
              </td>

              {/* Price India */}
              <td className="px-3 py-2 align-middle">
                <div className="flex items-center gap-1">
                  <span aria-hidden>₹</span>
                  <Input
                    inputMode="decimal"
                    aria-label={`Price India row ${i + 1}`}
                    value={row.priceIndia}
                    onChange={(e) => edit(row.id, "priceIndia", e.target.value)}
                    className="h-8"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Optional helper: row count */}
      <div className="border-t px-3 py-2 text-xs text-muted-foreground">{rows.length} variants</div>
    </div>
  )
}
export default VariantsDetails