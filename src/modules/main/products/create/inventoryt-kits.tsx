"use client";

import React, { useCallback, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParaSkeleton } from "@/components/skeletons/para-skeleton";
import { capitalizeFirstLetter } from "@/services/helpers";
import { useGetAllInventoryQuery } from "@/state/inventory-api";

/* ----------------------------- Types -------------------------------- */

export interface Variant {
  id: string;
  title: string;
  has_inventory_kit: boolean;
  managed_inventory: boolean;
}

export interface VariantKitItem {
  id: string;
  itemId: string;
  itemTitle: string;
  quantity: string; // keep as string to bind to inputs; parent can normalize
}

export interface InventoryItem {
  _id: string;
  title: string;
  // add other inventory fields used by your app
}

interface InventoryKitsProps {
  variants: Variant[]; // pass product variants here (rows from VariantPriceEditor)
  kits: Record<string, VariantKitItem[]>;
  setKits: React.Dispatch<
    React.SetStateAction<Record<string, VariantKitItem[]>>
  >;
}

/* --------------------------- Utilities -------------------------------- */

/** lightweight unique id generator — sufficient for client-side keys */
const mkId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

/* --------------------------- Component -------------------------------- */

const InventoryKits: React.FC<InventoryKitsProps> = ({
  variants,
  kits,
  setKits,
}) => {
  // fetch inventory list (the items you can pick in Select)
  const { data, isLoading } = useGetAllInventoryQuery({
    rowsPerPage: 100,
    page: 1,
  });

  const inventoryList = useMemo(() => data?.result || [], [data]);

  // only show variants that support kits
  const kitVariants = useMemo(
    () => variants.filter((v) => v.has_inventory_kit && v.managed_inventory),
    [variants]
  );

  /* ---------------------- CRUD helpers for kits ---------------------- */

  const addItem = useCallback(
    (variantId: string) => {
      setKits((prev) => ({
        ...prev,
        [variantId]: [
          ...(prev[variantId] || []),
          { id: mkId(), itemId: "", itemTitle: "", quantity: "0" },
        ],
      }));
    },
    [setKits]
  );

  const removeItem = useCallback(
    (variantId: string, id: string) => {
      setKits((prev) => {
        const copy = { ...prev };
        copy[variantId] = (copy[variantId] || []).filter((i) => i.id !== id);
        return copy;
      });
    },
    [setKits]
  );

  const updateItemField = useCallback(
    (variantId: string, id: string, patch: Partial<VariantKitItem>) => {
      setKits((prev) => ({
        ...prev,
        [variantId]: (prev[variantId] || []).map((it) =>
          it.id === id ? { ...it, ...patch } : it
        ),
      }));
    },
    [setKits]
  );

  /* ------------------------- Save / payload -------------------------- */

  // const buildPayload = useCallback(() => {
  //   return Object.entries(kits).map(([variantId, options]) => ({
  //     variantId,
  //     options: options.map((o) => ({
  //       id: o.id,
  //       itemId: o.itemId,
  //       itemTitle: o.itemTitle,
  //       quantity: Number(o.quantity) || 0,
  //     })),
  //   }));
  // }, [kits]);

  /* ------------------------ UI: per-variant rows --------------------- */

  if (!kitVariants.length) return null;

  return (
    <div className="p-6 space-y-6 max-w-[1000px] m-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Inventory kits</h2>
      </div>

      {kitVariants.map((variant) => {
        const variantRows = kits[variant.id] || [];
        const addDisabled = inventoryList.length === 0;

        return (
          <section key={variant.id} className="space-y-4 border-b pb-8">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg">{variant.title}</p>
              <Button
                variant="outline"
                onClick={() => addItem(variant.id)}
                disabled={addDisabled}
              >
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              Add inventory items to this variant&apos;s inventory kit.
            </p>

            <div className="space-y-3">
              {!variantRows.length && (
                <p className="text-sm text-gray-400">No items added yet.</p>
              )}

              {variantRows.map((row) => (
                <div
                  key={row.id}
                  className="bg-gray-50 p-3 rounded grid grid-cols-12 gap-4 items-start"
                >
                  <div className="col-span-11 space-y-2">
                    <div className="grid grid-cols-12 items-center">
                      <Label className="text-xs font-medium text-gray-700 col-span-2">
                        Item
                      </Label>

                      <div className="col-span-10">
                        <Select
                          onValueChange={(val) => {
                            const found = inventoryList.find(
                              (it) => it._id === val
                            );
                            updateItemField(variant.id, row.id, {
                              itemId: val,
                              itemTitle: found?.title ?? "",
                            });
                          }}
                          value={row.itemId || undefined}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select item">
                              {row.itemTitle
                                ? capitalizeFirstLetter(row.itemTitle)
                                : null}
                            </SelectValue>
                          </SelectTrigger>

                          <SelectContent>
                            {isLoading
                              ? Array.from({ length: 4 }).map((_, i) => (
                                  <ParaSkeleton
                                    key={i}
                                    style="h-4 w-full my-[4px]"
                                  />
                                ))
                              : inventoryList.map((it) => {
                                  const isAlreadyUsed = variantRows.some(
                                    (other) =>
                                      other.itemId === it._id &&
                                      other.id !== row.id
                                  );

                                  return (
                                    <SelectItem
                                      key={it._id}
                                      value={it._id || ""}
                                      disabled={isAlreadyUsed}
                                      className={
                                        isAlreadyUsed
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }
                                    >
                                      {capitalizeFirstLetter(it.title)}
                                    </SelectItem>
                                  );
                                })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 items-start">
                      <Label className="text-xs font-medium text-gray-700 col-span-2">
                        Quantity
                      </Label>

                      <div className="col-span-10">
                        <Input
                          value={row.quantity ?? ""}
                          type="number"
                          placeholder="How many of these are needed for the kit?"
                          onChange={(e) =>
                            updateItemField(variant.id, row.id, {
                              // strip any whitespace; keep as string for controlled input
                              quantity: e.target.value.replace(/\s+/g, ""),
                            })
                          }
                          className="flex-1 max-h-[34px] bg-white text-xs"
                          min={0}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <Button
                      onClick={() => removeItem(variant.id, row.id)}
                      variant="ghost"
                      size="icon"
                      title="Remove option"
                      className="text-gray-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default React.memo(InventoryKits);
