"use client";
import React, { useMemo, useState } from "react";
// import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical } from "lucide-react";
import { useStringReorder } from "@/hooks/useReorder";

interface ProductOption {
  _id: string;
  title: string;
  values: string[];
}

export const cartesian = (arrays: string[][]): string[][] =>
  arrays.reduce<string[][]>(
    (acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])),
    [[]]
  );

export const getRowKey = (row: Record<string, string>) => {
  const entries = Object.entries(row)
    .filter(([k, v]) => k && v)
    .sort(([a], [b]) => a.localeCompare(b));

  return JSON.stringify(entries);
};

interface Props {
  productOptions: ProductOption[];
  //   setProductOptions: React.Dispatch<React.SetStateAction<ProductOption[]>>;
}

type VariantRow = Record<string, string>;

const ProductVariants = ({ productOptions }: Props) => {
  //   const [selected, setSelected] = useState<Set<string>>(new Set());
  const [variantOrder, setVariantOrder] = useState<string[]>([]);

  const { onDragStart, onDragOver, onDrop } = useStringReorder(setVariantOrder);

  // CLEAN active options
  const activeOptions = useMemo(
    () =>
      productOptions
        .filter((o) => o.title.trim() && o.values.length)
        .map((o) => ({ title: o.title.trim(), values: o.values })),
    [productOptions]
  );

  // Generate variant matrix
  const variantRows = useMemo(() => {
    if (!activeOptions.length) return [];

    const matrix = activeOptions.map((o) => o.values);
    const combinations = cartesian(matrix);

    return combinations.map((vals) =>
      vals.reduce((acc, v, i) => {
        acc[activeOptions[i].title] = v;
        return acc;
      }, {} as VariantRow)
    );
  }, [activeOptions]);

  // Maintain custom ordering
  const orderedVariantRows = useMemo(() => {
    const map = new Map(variantRows.map((r) => [getRowKey(r), r]));
    return variantOrder.map((k) => map.get(k)).filter(Boolean) as VariantRow[];
  }, [variantRows, variantOrder]);

  // Auto-add new rows to order
  React.useEffect(() => {
    const keys = variantRows.map((r) => getRowKey(r));
    setVariantOrder((prev) => [
      ...prev.filter((k) => keys.includes(k)),
      ...keys.filter((k) => !prev.includes(k)),
    ]);
  }, [variantRows]);

  // Toggle individual
  //   const toggleRow = useCallback((row: VariantRow) => {
  //     const key = getRowKey(row);
  //     setSelected((prev) => {
  //       const copy = new Set(prev);
  //       copy.has(key) ? copy.delete(key) : copy.add(key);
  //       return copy;
  //     });
  //   }, []);

  // Toggle all
  //   const allChecked =
  //     orderedVariantRows.length > 0 &&
  //     orderedVariantRows.every((r) => selected.has(getRowKey(r)));

  //   const someChecked =
  //     !allChecked && orderedVariantRows.some((r) => selected.has(getRowKey(r)));

  //   const toggleAll = (state: boolean) => {
  //     setSelected(() => {
  //       if (!state) return new Set();
  //       return new Set(orderedVariantRows.map((r) => getRowKey(r)));
  //     });
  //   };

  if (!orderedVariantRows.length) return null;

  const optionTitles = activeOptions.map((o) => o.title);

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Product Variants</h2>
        <p className="text-xs text-gray-500">
          This ranking will affect the variants' order in your storefront.
        </p>
      </div>

      <div className="bg-white shadow rounded border">
        {/* Header */}
        <div className="grid grid-cols-12 items-center p-3 border bg-gray-50">
          {/* <div className="col-span-2 flex items-center gap-2">
            <Checkbox
              checked={allChecked}
              data-state={someChecked ? "indeterminate" : undefined}
              onCheckedChange={(v) => toggleAll(Boolean(v))}
            />
          </div> */}
          <div className="col-span-1 flex items-center gap-2">
            {/* <GripVertical className="cursor-grab opacity-60" size={16} /> */}
          </div>
          <div className="col-span-11 grid grid-cols-5 gap-4">
            {optionTitles.map((title) => (
              <div key={title} className="font-medium text-sm">
                {title}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {orderedVariantRows.map((row, idx) => {
          const key = getRowKey(row);
          //   const isChecked = selected.has(key);

          return (
            <div
              key={key}
              draggable
              onDragStart={onDragStart(idx)}
              onDragOver={onDragOver}
              onDrop={onDrop(idx)}
              className="grid grid-cols-12 items-center p-3 border-t bg-gray-50 hover:bg-gray-100"
            >
              <div className="col-span-1 flex items-center gap-2">
                {/* <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => toggleRow(row)}
                /> */}
                <GripVertical className="cursor-grab opacity-60" size={16} />
              </div>

              <div className="col-span-11 grid grid-cols-5 gap-4">
                {optionTitles.map((title) => (
                  <span
                    key={title}
                    className="bg-white px-2 py-1 border rounded text-sm truncate"
                  >
                    {row[title]}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVariants;
