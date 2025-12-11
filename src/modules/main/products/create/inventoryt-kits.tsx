"use client";

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import VariantsAddOptions from "./variants/variants-add-options";
import { ProductOption } from "./variants/variants";
import VariantsAddQntyPrice from "./variants/variants-add-qty-price";
import { useGetAllInventoryQuery } from "@/state/inventory-api";

interface Variant {
  id: string;
  title: string;
  has_inventory_kit: boolean;
  managed_inventory: boolean;
}

export interface VariantKitItem {
  id: string;
  item: string;
  quantity: string;
}

const InventorytKits = ({ variants }: { variants: Variant[] }) => {
  const [kits, setKits] = useState<Record<string, VariantKitItem[]>>({});
  const [productOptions, setProductOptions] = useState<VariantKitItem[]>([]);
   const { data, isLoading, error } = useGetAllInventoryQuery({
      rowsPerPage:100,
      page: 1,
    });
      const result = useMemo(() => data?.result || [], [data?.result]);
  const addItem = (variantId: string) => {
    setKits((prev) => ({
      ...prev,
      [variantId]: [
        ...(prev[variantId] || []),
        { id: crypto.randomUUID(), item: "", quantity: "" },
      ],
    }));
  };
  console.log(variants);
  const removeItem = (variantId: string, id: string) => {
    setKits((prev) => ({
      ...prev,
      [variantId]: prev[variantId].filter((i) => i.id !== id),
    }));
  };

  const updateItem = (
    variantId: string,
    id: string,
    field: "item" | "quantity",
    value: string
  ) => {
    setKits((prev) => ({
      ...prev,
      [variantId]: prev[variantId].map((i) =>
        i.id === id ? { ...i, [field]: value } : i
      ),
    }));
  };

  // show section only if ANY variant supports inventory kit
  const showSection = variants.some(
    (v) => v.has_inventory_kit && v.managed_inventory
  );

  if (!showSection) return null;

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-semibold">Inventory kits</h2>

      {variants.map((variant) => (
        <div key={variant.id} className="space-y-4 border-b pb-8">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-lg">{variant.title}</p>

            <Button variant="outline" onClick={() => addItem(variant.id)}>
              Add
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            Add inventory items to the variant's inventory kit.
          </p>

          {/* ITEM ROWS */}
          {/* {variantRows.map((row) => ( */}
          <VariantsAddQntyPrice
            productOptions={productOptions}
            setProductOptions={setProductOptions}
            result={result}
            isLoading={isLoading}
          />
          {/* ))} */}

          {/* If no rows */}
          {/* {variantRows.length === 0 && (
            <p className="text-sm text-gray-400">No items added yet.</p>
          )} */}
        </div>
      ))}
    </div>
  );
};
export default InventorytKits;
