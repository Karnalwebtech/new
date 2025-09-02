"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, GripVertical, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useReorder } from "@/hooks/useReorder";

type ProductOption = {
  _id: string;
  title: string;
  values: string[];
};

type VariantRow = Record<string, string>; // e.g. { Color: "Red", Size: "M" }

const cartesian = (arrays: string[][]): string[][] => {
  return arrays.reduce<string[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])),
    [[]]
  );
};

const normalizeTokens = (raw: string) =>
  raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const mkId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const Variants = () => {
  const [hasVariants, setHasVariants] = useState(false);

  // options + per-option input box value
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [inputs, setInputs] = useState<Record<string, string>>({});

  // Reorder handlers for OPTIONS list
  const {
    onDragStart: onOptionDragStart,
    onDragOver: onOptionDragOver,
    onDrop: onOptionDrop,
  } = useReorder(setProductOptions);

  // which variant rows are selected (to "create")
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const addOption = useCallback(() => {
    setProductOptions((prev) => [
      ...prev,
      { _id: mkId(), title: "", values: [] },
    ]);
  }, []);

  const removeOption = useCallback((id: string) => {
    setProductOptions((prev) => prev.filter((o) => o._id !== id));
    setInputs((prev) => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const updateOptionTitle = useCallback((id: string, title: string) => {
    setProductOptions((prev) =>
      prev.map((o) => (o._id === id ? { ...o, title } : o))
    );
  }, []);

  const addOptionValues = useCallback((id: string, raw: string) => {
    const tokens = normalizeTokens(raw);
    if (!tokens.length) return;

    setProductOptions((prev) =>
      prev.map((o) =>
        o._id === id
          ? {
              ...o,
              values: Array.from(new Set([...o.values, ...tokens])), // de-dupe
            }
          : o
      )
    );
    setInputs((prev) => ({ ...prev, [id]: "" }));
  }, []);

  const removeOptionValue = useCallback((id: string, idx: number) => {
    setProductOptions((prev) =>
      prev.map((o) =>
        o._id === id
          ? { ...o, values: o.values.filter((_, i) => i !== idx) }
          : o
      )
    );
  }, []);

  const onValueKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
      if ((e.key === "Enter" || e.key === ",") && inputs[id]?.trim()) {
        e.preventDefault();
        addOptionValues(id, inputs[id]);
      }
    },
    [inputs, addOptionValues]
  );

  // Generate all variant combinations in stable column order (option titles order)
  const variantRows: VariantRow[] = useMemo(() => {
    const active = productOptions
      .filter(
        (o): o is ProductOption =>
          !!o && typeof o.title === "string" && Array.isArray(o.values)
      )
      .map((o) => ({ title: o.title.trim(), values: o.values }))
      .filter((o) => o.title && o.values.length);

    if (!active.length) return [];

    const matrix = active.map((o) => o.values);
    const tuples = cartesian(matrix); // array of arrays, each length = active.length

    return tuples.map((vals) => {
      const row: VariantRow = {};
      active.forEach((o, i) => {
        row[o.title] = vals[i];
      });
      return row;
    });
  }, [productOptions]);

  const keyOf = useCallback(
    (row: VariantRow) =>
      JSON.stringify(
        productOptions
          .filter((o): o is ProductOption => !!o && typeof o.title === "string")
          .map((o) => o.title.trim())
          .filter(Boolean)
          .reduce<Record<string, string>>((acc, t) => {
            if (row[t] != null) acc[t] = row[t];
            return acc;
          }, {})
      ),
    [productOptions]
  );

  // Keep selectedKeys valid when productOptions change
  useEffect(() => {
    setSelectedKeys((prev) => {
      const keep = new Set<string>();
      const titles = new Set(
        productOptions
          .filter((o): o is ProductOption => !!o && typeof o.title === "string")
          .map((o) => o.title.trim())
          .filter(Boolean)
      );
      for (const k of prev) {
        try {
          const obj = JSON.parse(k) as Record<string, string>;
          if (Object.keys(obj).every((t) => titles.has(t))) keep.add(k);
        } catch {
          // ignore parse errors
        }
      }
      return keep;
    });
  }, [productOptions]);

  // ----- Variant ordering state & DnD (SEPARATE from options) -----
  const [variantOrder, setVariantOrder] = useState<string[]>([]);

  // Sync variantOrder with current rows: keep existing order, drop stale, append new
  useEffect(() => {
    const keys = variantRows.map((r) => keyOf(r));
    setVariantOrder((prev) => {
      const existing = new Set(keys);
      const kept = prev.filter((k) => existing.has(k));
      const added = keys.filter((k) => !prev.includes(k));
      return [...kept, ...added];
    });
  }, [variantRows, keyOf]);

  const orderedVariantRows = useMemo(() => {
    const byKey = new Map(variantRows.map((r) => [keyOf(r), r]));
    return variantOrder
      .map((k) => byKey.get(k))
      .filter(Boolean) as VariantRow[];
  }, [variantRows, variantOrder, keyOf]);

  const {
    onDragStart: onVariantDragStart,
    onDragOver: onVariantDragOver,
    onDrop: onVariantDrop,
  } = useReorder(setVariantOrder);

  // ----- Selection helpers -----
  const allChecked =
    orderedVariantRows.length > 0 &&
    orderedVariantRows.every((r) => selectedKeys.has(keyOf(r)));
  const someChecked =
    orderedVariantRows.length > 0 &&
    !allChecked &&
    orderedVariantRows.some((r) => selectedKeys.has(keyOf(r)));

  const toggleAll = useCallback(
    (checked: boolean) => {
      if (!orderedVariantRows.length) return;
      setSelectedKeys((prev) => {
        if (checked) {
          const next = new Set(prev);
          orderedVariantRows.forEach((r) => next.add(keyOf(r)));
          return next;
        } else {
          const next = new Set(prev);
          orderedVariantRows.forEach((r) => next.delete(keyOf(r)));
          return next;
        }
      });
    },
    [orderedVariantRows, keyOf]
  );

  const toggleRow = useCallback(
    (row: VariantRow) => {
      const k = keyOf(row);
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        if (next.has(k)) next.delete(k);
        else next.add(k);
        return next;
      });
    },
    [keyOf]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Variants</h3>

      <div className="shadow-md bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Checkbox
            id="has-variants"
            checked={hasVariants}
            onCheckedChange={(v) => setHasVariants(Boolean(v))}
            className="mt-0.5"
          />
          <div className="space-y-1">
            <Label
              htmlFor="has-variants"
              className="text-sm font-medium text-gray-900 cursor-pointer"
            >
              Yes, this is a product with variants
            </Label>
            <p className="text-sm text-gray-600">
              When unchecked, we will create a default variant for you.
            </p>
          </div>
        </div>
      </div>

      {hasVariants && (
        <div className="px-4 py-8  space-y-8">
          {/* Product Options */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-medium text-gray-900">
                  Product options
                </h2>
                <p className="text-xs text-gray-500">
                  Define the options for the product, e.g. color, size, etc.
                </p>
              </div>
              <Button
                onClick={addOption}
                variant="outline"
                size="sm"
                className="gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>

            <div className="space-y-4">
              {productOptions.map((option, i) => (
                <div
                  key={option._id} // stable key!
                  className="mb-2 bg-gray-100 p-3 rounded-lg shadow grid grid-cols-12 items-center gap-4"
                  draggable
                  onDragStart={onOptionDragStart(i)}
                  onDragOver={onOptionDragOver}
                  onDrop={onOptionDrop(i)}
                >
                  <div className="col-span-11 space-y-2">
                    <div className="grid grid-cols-12 items-center">
                      <Label
                        htmlFor={`title-${option._id}`}
                        className="text-xs font-medium text-gray-700 col-span-2"
                      >
                        Title
                      </Label>
                      <Input
                        id={`title-${option._id}`}
                        value={option.title}
                        placeholder="Color"
                        onChange={(e) =>
                          updateOptionTitle(option._id, e.target.value)
                        }
                        className="max-h-[30px] w-full col-span-10 bg-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-12 items-start">
                      <Label className="text-xs font-medium text-gray-700 col-span-2">
                        Values
                      </Label>
                      <div className="col-span-10 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {option.values.map((value, idx) => (
                            <Badge
                              key={`${value}-${idx}`}
                              onClick={() => removeOptionValue(option._id, idx)}
                              variant="outline"
                              className="text-gray-700 bg-white hover:text-gray-700 rounded-full px-3 py-[6px] cursor-pointer"
                              title="Click to remove"
                            >
                              {value} <X className="w-4 h-4 ml-1" />
                            </Badge>
                          ))}
                          <Input
                            value={inputs[option._id] ?? ""}
                            placeholder="Type value and press Enter/Comma"
                            onChange={(e) =>
                              setInputs((p) => ({
                                ...p,
                                [option._id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => onValueKeyDown(e, option._id)}
                            onBlur={() =>
                              inputs[option._id]?.trim() &&
                              addOptionValues(option._id, inputs[option._id])
                            }
                            className="flex-1 max-h-[30px] bg-white text-xs min-w-[160px]"
                          />
                        </div>
                        {option.values.length > 0 && (
                          <p className="text-[10px] text-gray-500">
                            Tip: Click a chip to remove it. Duplicate values are
                            automatically ignored.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <Button
                      onClick={() => removeOption(option._id)}
                      variant="ghost"
                      size="icon"
                      className="text-gray-600"
                      title="Remove option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Variants */}
          {orderedVariantRows.length > 0 && (
            <div className="">
              <div className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Product variants
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  This ranking will affect the variants’ order in your
                  storefront.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow border">
                {/* Header */}
                <div className="grid grid-cols-12 items-center p-3 border bg-gray-50 rounded-lg">
                  <div className="col-span-2 flex items-center gap-2">
                    <Checkbox
                      checked={allChecked}
                      onCheckedChange={(v) => toggleAll(Boolean(v))}
                      className={
                        someChecked
                          ? "data-[state=indeterminate]:opacity-100"
                          : ""
                      }
                      data-state={
                        someChecked
                          ? "indeterminate"
                          : allChecked
                          ? "checked"
                          : "unchecked"
                      }
                    />
                  </div>
                  <div className="col-span-10 flex justify-evenly items-center">
                    {productOptions
                      .filter(
                        (o): o is ProductOption =>
                          !!o && typeof o.title === "string"
                      )
                      .map((o) => o.title.trim())
                      .filter(Boolean)
                      .map((title) => (
                        <div key={title} className="text-sm text-gray-900">
                          {title}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Rows */}
                <div className="bg-gray-50 rounded-lg divide-y">
                  {orderedVariantRows.map((row, idx) => {
                    const k = keyOf(row);
                    const checked = selectedKeys.has(k);
                    return (
                      <div
                        key={k}
                        draggable
                        className="grid grid-cols-12 items-center py-2 px-4 border-b-2"
                        onDragStart={onVariantDragStart(idx)}
                        onDragOver={onVariantDragOver}
                        onDrop={onVariantDrop(idx)}
                      >
                        <div className="col-span-2 flex items-center gap-2">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleRow(row)}
                          />
                          <GripVertical className="mr-2 opacity-60 group-hover:opacity-100 cursor-grab" />
                        </div>
                        <div className="col-span-10 flex justify-evenly items-center">
                          {Object.entries(row).map(([key, val]) => (
                            <span
                              key={`${key}-${val}-${idx}`}
                              className="px-2 py-1 bg-white text-sm"
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Info Tip */}
          <div className="mt-4 p-3 bg-blue-50 border-l-4 rounded-r-lg">
            <p className="text-sm ">
              <span className="font-bold text-base">Tip: </span>
              <span className="text-sm text-gray-700">
                Variants left unchecked won&apos;t be created. You can always
                create and edit variants afterwards but this list fits the
                variations in your product options.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Variants;
