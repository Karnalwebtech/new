"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { ProductOption } from "./variants";
import { capitalizeFirstLetter, normalizeTokens } from "@/services/helpers";
import { VariantKitItem } from "../inventoryt-kits";
import { InventoryType } from "@/types/inventory-type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ParaSkeleton } from "@/components/skeletons/para-skeleton";
interface VariantsAddQntyPriceProps {
  productOptions: VariantKitItem[];
  setProductOptions: React.Dispatch<React.SetStateAction<VariantKitItem[]>>;
  result: InventoryType[];
  isLoading?: boolean;
}

const VariantsAddQntyPrice = ({
  productOptions,
  setProductOptions,
  result,
  isLoading = false,
}: VariantsAddQntyPriceProps) => {
  const mkId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const inputsRef = useRef(inputs);

  /** Keep ref and state in sync */
  const updateInput = (id: string, value: string) => {
    setInputs((prev) => {
      const next = { ...prev, [id]: value };
      inputsRef.current = next;
      return next;
    });
  };

  /** --- OPTION CRUD --- */
  const addOption = useCallback(() => {
    const id = mkId();

    setProductOptions((prev) => [
      ...prev,
      {
        _id: id,
        sku: "",
        managed_inventory: false,
        allow_backorder: false,
        has_inventory_kit: false,
        title: "",
        values: [],
      },
    ]);

    updateInput(id, "");
  }, [setProductOptions]);

  const updateOptionTitle = useCallback(
    (id: string, title: string) => {
      setProductOptions((prev) =>
        prev.map((o) => (o._id === id ? { ...o, title } : o))
      );
    },
    [setProductOptions]
  );
  const handleBlurTitle = (id: string) => {
    const option = productOptions.find((o) => o._id === id);
    if (!option) return;

    const isDuplicate = productOptions
      .filter((o) => o._id !== id)
      .some((o) => o.title === option.title);

    if (isDuplicate) {
      setErrors((prev) => ({ ...prev, [id]: "Option title already exists!" }));
    } else {
      setErrors((prev) => ({ ...prev, [id]: "" })); // clear error if valid
    }
  };

  const removeOption = useCallback(
    (id: string) => {
      setProductOptions((prev) => prev.filter((o) => o._id !== id));

      setInputs((prev) => {
        const next = { ...prev };
        delete next[id];
        inputsRef.current = next;
        return next;
      });
    },
    [setProductOptions]
  );

  /** --- VALUES CRUD --- */
  const addOptionValues = useCallback(
    (id: string, raw: string) => {
      const tokens = normalizeTokens(raw);
      if (!tokens.length) return;

      setProductOptions((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, values: Array.from(new Set([...o.values, ...tokens])) }
            : o
        )
      );
    },
    [setProductOptions]
  );

  const removeOptionValue = useCallback(
    (id: string, idx: number) => {
      setProductOptions((prev) =>
        prev.map((o) =>
          o._id === id
            ? { ...o, values: o.values.filter((_, i) => i !== idx) }
            : o
        )
      );
    },
    [setProductOptions]
  );

  /** --- INPUT HANDLERS --- */
  const handleInputValue = (id: string, raw: string) => {
    updateInput(id, raw);
  };

  const onValueKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
      const value = inputsRef.current[id]?.trim();
      if (!value) return;

      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addOptionValues(id, value);
        updateInput(id, "");
      }
    },
    [addOptionValues]
  );

  return (
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
            key={`${option._id}-${i}`}
            className="mb-2 bg-gray-100 p-3 rounded-lg shadow grid grid-cols-12 items-center gap-4"
          >
            <div className="col-span-11 space-y-2">
              {/* TITLE */}
              <div className="grid grid-cols-12 items-center">
                <Label
                  htmlFor={`Item-${option._id}`}
                  className="text-xs font-medium text-gray-700 col-span-2"
                >
                  Item
                </Label>
                <Select
                // value={value}
                // onValueChange={(newValue) => {
                //   // 🔹 Store the isoCode (if available) or the selected key
                //   const selected = optionMap.get(newValue);
                //   if (selected) {
                //     // Push ISO to shared CSC state if available
                //     if (selected.isoCode) console.log(name);
                //     if (name === "country") {
                //       setCscCode?.({ countryCode: selected.isoCode });
                //     } else if (name === "state") {
                //       setCscCode?.({ stateCode: selected.stateCode });
                //     }
                //   }
                //   // Prevent empty string resets by not calling onChange when value is empty
                //   // unless the current value is already defined (intentional clearing)
                //   if (newValue !== "" || field.value) {
                //     field.onChange(newValue);
                //   }
                //   // Always trigger onBlur to mark the field as touched
                //   field.onBlur();
                // }}
                // disabled={is_disabled}
                >
                  <SelectTrigger className={`w-full`}>
                    {/* <SelectValue placeholder={placeholder} /> */}
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <ParaSkeleton key={i} style={"h-4 w-full my-[4px]"} />
                        ))
                      : result.map(({ _id, title }) => (
                          <SelectItem
                            key={_id}
                            value={title}
                            className="cursor-pointer hover:bg-gray-100 flex gap-6 items-center"
                          >
                            <span>{capitalizeFirstLetter(title)}</span>
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                {/* <div className="col-span-6">
                  {errors[option._id] && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors[option._id]}
                    </p>
                  )}
                </div> */}
              </div>

              {/* VALUES */}
              <div className="grid grid-cols-12 items-start">
                <Label className="text-xs font-medium text-gray-700 col-span-2">
                  Quantity
                </Label>

                <div className="col-span-10 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Input
                      value={inputs[option._id] ?? ""}
                      type="number"
                      placeholder="How many of ttthese are needed for the kit?"
                      onChange={(e) =>
                        handleInputValue(option._id, e.target.value)
                      }
                      disabled={Boolean(errors[option._id])}
                      className="flex-1 max-h-[30px] bg-white text-xs min-w-[160px] disabled:bg-gray-200 disabled:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* DELETE OPTION */}
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
  );
};

export default VariantsAddQntyPrice;
