"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, GripVertical, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useReorder, useStringReorder } from "@/hooks/useReorder";

type ProductOption = {
  _id: string;
  title: string;
  values: string[];
};

type VariantRow = Record<string, string>;

// Memoized utility functions
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

interface VariantsProps {
  hasVariant: boolean;
}

const Variants = ({ hasVariant }: VariantsProps) => {
  // Options state - ALWAYS CALL THESE HOOKS
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const inputsRef = useRef(inputs);
  
  // Variant selection and ordering
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [variantOrder, setVariantOrder] = useState<string[]>([]);

  // Update ref on every render
  useEffect(() => {
    inputsRef.current = inputs;
  }, [inputs]);

  // Reorder hooks - ALWAYS CALL THESE
  const {
    onDragStart: onOptionDragStart,
    onDragOver: onOptionDragOver,
    onDrop: onOptionDrop,
  } = useReorder(setProductOptions);

  const {
    onDragStart: onVariantDragStart,
    onDragOver: onVariantDragOver,
    onDrop: onVariantDrop,
  } = useStringReorder(setVariantOrder);

  // Memoized active options - ALWAYS CALL THIS
  const activeOptions = useMemo(() => 
    productOptions
      .filter((o): o is ProductOption =>
        !!o && typeof o.title === "string" && Array.isArray(o.values)
      )
      .map((o) => ({ title: o.title.trim(), values: o.values }))
      .filter((o) => o.title && o.values.length),
    [productOptions]
  );

  // Generate variant rows - ALWAYS CALL THIS
  const variantRows: VariantRow[] = useMemo(() => {
    if (!activeOptions.length) return [];

    const matrix = activeOptions.map((o) => o.values);
    const tuples = cartesian(matrix);

    return tuples.map((vals) => {
      const row: VariantRow = {};
      activeOptions.forEach((o, i) => {
        row[o.title] = vals[i];
      });
      return row;
    });
  }, [activeOptions]);

  // Generate row key - memoized callback - ALWAYS CALL THIS
  const getRowKey = useCallback((row: VariantRow) => {
    const entries = Object.entries(row)
      .filter(([key, value]) => key && value)
      .sort(([a], [b]) => a.localeCompare(b));
    return JSON.stringify(entries);
  }, []);

  // Keep variant order in sync
  useEffect(() => {
    const keys = variantRows.map((r) => getRowKey(r));
    setVariantOrder((prev) => {
      const existing = new Set(keys);
      const kept = prev.filter((k) => existing.has(k));
      const added = keys.filter((k) => !prev.includes(k));
      return [...kept, ...added];
    });
  }, [variantRows, getRowKey]);

  // Ordered variant rows - ALWAYS CALL THIS
  const orderedVariantRows = useMemo(() => {
    const byKey = new Map(variantRows.map((r) => [getRowKey(r), r]));
    return variantOrder
      .map((k) => byKey.get(k))
      .filter(Boolean) as VariantRow[];
  }, [variantRows, variantOrder, getRowKey]);

  // Option titles for display - ALWAYS CALL THIS
  const optionTitles = useMemo(() =>
    productOptions
      .filter((o): o is ProductOption => !!o && typeof o.title === "string")
      .map((o) => o.title.trim())
      .filter(Boolean),
    [productOptions]
  );

  // Option handlers - ALL THESE CALLBACKS MUST BE CALLED EVERY RENDER
  const addOption = useCallback(() => {
    const newId = mkId();
    setProductOptions((prev) => [
      ...prev,
      { _id: newId, title: "", values: [] },
    ]);
    setInputs((prev) => ({ ...prev, [newId]: "" }));
  }, []);

  const removeOption = useCallback((id: string) => {
    setProductOptions((prev) => prev.filter((o) => o._id !== id));
    setInputs((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
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
              values: Array.from(new Set([...o.values, ...tokens])),
            }
          : o
      )
    );
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
      if ((e.key === "Enter" || e.key === ",") && inputsRef.current[id]?.trim()) {
        e.preventDefault();
        addOptionValues(id, inputsRef.current[id]);
        setInputs((prev) => ({ ...prev, [id]: "" }));
      }
    },
    [addOptionValues]
  );

  // Selection helpers - ALWAYS CALL THESE
  const allChecked = useMemo(() => 
    orderedVariantRows.length > 0 &&
    orderedVariantRows.every((r) => selectedKeys.has(getRowKey(r))),
    [orderedVariantRows, selectedKeys, getRowKey]
  );

  const someChecked = useMemo(() => 
    orderedVariantRows.length > 0 &&
    !allChecked &&
    orderedVariantRows.some((r) => selectedKeys.has(getRowKey(r))),
    [orderedVariantRows, allChecked, selectedKeys, getRowKey]
  );

  const toggleAll = useCallback(
    (checked: boolean) => {
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        orderedVariantRows.forEach((r) => {
          const key = getRowKey(r);
          checked ? next.add(key) : next.delete(key);
        });
        return next;
      });
    },
    [orderedVariantRows, getRowKey]
  );

  const toggleRow = useCallback(
    (row: VariantRow) => {
      const k = getRowKey(row);
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        next.has(k) ? next.delete(k) : next.add(k);
        return next;
      });
    },
    [getRowKey]
  );

  // Early return if no variants - BUT ALL HOOKS HAVE BEEN CALLED ABOVE
  if (!hasVariant) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Variants</h3>
      </div>
    );
  }

  // Only render the content conditionally, but all hooks have been called
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Variants</h3>

      <div className="px-4 py-8 space-y-8">
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
                key={option._id}
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
                            key={`${option._id}-${value}-${idx}`}
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
                          onBlur={() => {
                            const value = inputs[option._id]?.trim();
                            if (value) {
                              addOptionValues(option._id, value);
                              setInputs((p) => ({ ...p, [option._id]: "" }));
                            }
                          }}
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
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Product variants
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                This ranking will affect the variants' order in your storefront.
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
                <div className="col-span-10 grid grid-cols-5 gap-4">
                  {optionTitles.map((title) => (
                    <div key={title} className="text-sm text-gray-900 truncate">
                      {title}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rows */}
              <div className="bg-gray-50 rounded-lg divide-y">
                {orderedVariantRows.map((row, idx) => {
                  const k = getRowKey(row);
                  const checked = selectedKeys.has(k);
                  return (
                    <div
                      key={k}
                      draggable
                      className="grid grid-cols-12 items-center py-2 px-4 border-b-2 hover:bg-gray-100"
                      onDragStart={onVariantDragStart(idx)}
                      onDragOver={onVariantDragOver}
                      onDrop={onVariantDrop(idx)}
                    >
                      <div className="col-span-2 flex items-center gap-2">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleRow(row)}
                        />
                        <GripVertical className="mr-2 opacity-60 cursor-grab hover:opacity-100" />
                      </div>
                      <div className="col-span-10 grid grid-cols-5 gap-4">
                        {optionTitles.map((title) => (
                          <span
                            key={`${title}-${k}`}
                            className="px-2 py-1 bg-white text-sm rounded border truncate"
                          >
                            {row[title] || "-"}
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
          <p className="text-sm">
            <span className="font-bold text-base">Tip: </span>
            <span className="text-sm text-gray-700">
              Variants left unchecked won't be created. You can always create
              and edit variants afterwards but this list fits the variations in
              your product options.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Variants;