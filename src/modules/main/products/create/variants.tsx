"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface ProductOption {
  id: number;
  title: string;
  values: string[];
}

interface ProductVariant {
  id: string;
  name: string;
  checked: boolean;
}
const Variants = () => {
  const [hasVariants, setHasVariants] = useState(false);
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});

  const [activeTab, setActiveTab] = useState("Details");
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  console.log(productOptions);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([
    { id: "1", name: "ssss", checked: true },
    { id: "2", name: "52222", checked: true },
  ]);
  const addProductOption = () => {
    const newOption: ProductOption = {
      id: Date.now().toString(),
      title: "",
      values: [],
    };
    setProductOptions([...productOptions, newOption]);
  };

  const updateOptionTitle = (id: string, title: string) => {
    setProductOptions((options) =>
      options.map((option) =>
        option.id === id ? { ...option, title } : option
      )
    );
  };

  const updateOptionValue = (optionId: number, newValue: string) => {
    setProductOptions((options) =>
      options.map((option) =>
        option.id === optionId
          ? { ...option, values: [...option.values, newValue] }
          : option
      )
    );
  };

  const removeOptionValue = (optionId: string, valueIndex: number) => {
    setProductOptions((options) =>
      options.map((option) =>
        option.id === optionId
          ? {
              ...option,
              values: option.values.filter((_, i) => i !== valueIndex),
            }
          : option
      )
    );
  };

  const toggleVariant = (id: string) => {
    setProductVariants((variants) =>
      variants.map((variant) =>
        variant.id === id ? { ...variant, checked: !variant.checked } : variant
      )
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    optionId: number
  ) => {
    if ((e.key === "Enter" || e.key === ",") && inputValues[optionId]?.trim()) {
      e.preventDefault();
      const newValue = inputValues[optionId].trim().replace(/,$/, "");
      updateOptionValue(optionId, newValue);
      setInputValues((prev) => ({ ...prev, [optionId]: "" })); // clear input for that option
    }
  };

  type Variant = {
    [key: string]: string;
  };
  // Recursive function to generate all variant combinations
  const generateVariants = (
    options: { title: string; values: string[] }[]
  ): Record<string, string>[] => {
    if (options.length === 0) return [{}];

    const [first, ...rest] = options;
    const restVariants = generateVariants(rest);

    return first.values.flatMap((value) =>
      restVariants.map((variant) => {
        // build object in consistent order
        const newVariant: Record<string, string> = {};
        [first, ...rest].forEach((opt) => {
          if (opt.title === first.title) {
            newVariant[opt.title] = value;
          } else {
            newVariant[opt.title] = variant[opt.title];
          }
        });
        return newVariant;
      })
    );
  };

  const variants = generateVariants(productOptions);
  console.log(variants);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Variants</h3>
      <div className="shadow-md bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Checkbox
            id="has-variants"
            checked={hasVariants}
            onCheckedChange={(checked) => setHasVariants(checked as boolean)}
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
        <div className="p-8 space-y-8">
          {/* Product Options Section */}
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
              <Button onClick={addProductOption} variant="outline" size="sm">
                Add
              </Button>
            </div>

            <div className="space-y-4">
              {productOptions.map((option) => (
                <div
                  key={option.id}
                  className="mb-2 bg-gray-100 p-3 rounded-lg shadow-md grid grid-cols-12 items-center gap-4"
                >
                  <div className="col-span-11">
                    <div className="grid grid-cols-12 items-center">
                      <Label
                        htmlFor={`title-${option.id}`}
                        className="text-xs font-medium text-gray-700 col-span-1"
                      >
                        Title
                      </Label>
                      <Input
                        id={`title-${option.id}`}
                        value={option.title}
                        placeholder="Color"
                        onChange={(e) =>
                          updateOptionTitle(option.id, e.target.value)
                        }
                        className="max-h-[30px] w-full col-span-11 bg-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-12 items-center">
                      <Label className="text-xs font-medium text-gray-700 col-span-1">
                        Values
                      </Label>
                      <div className="mt-1 space-y-2 col-span-11">
                        <div className="flex items-center gap-2 flex-wrap">
                          {option.values.length > 0 &&
                            option.values.map((value, valueIndex) => (
                              <div
                                key={valueIndex}
                                className="flex items-center gap-2"
                              >
                                <Badge
                                  onClick={() =>
                                    removeOptionValue(option.id, valueIndex)
                                  }
                                  variant={"outline"}
                                  className="text-gray-600 bg-white hover:text-gray-600 rounded-full px-3 py-[6px]"
                                >
                                  {value}{" "}
                                  <X className="w-4 h-4 cursor-pointer text-red ml-[3px]" />
                                </Badge>
                              </div>
                            ))}
                          <Input
                            value={inputValues[option.id] || ""}
                            placeholder="Red, Blue, Green"
                            onChange={(e) =>
                              setInputValues((prev) => ({
                                ...prev,
                                [option.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => handleKeyDown(e, option.id)}
                            className="flex-1 max-h-[30px] bg-white text-xs min-w-[100px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      onClick={addProductOption}
                      variant="ghost"
                      size="sm"
                      className="p-2 text-center"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Variants Section */}
        {variants.length > 0 &&
  Object.entries(variants[0]).length > 0 &&
  (Object.entries(variants[0])[0][1]?.length ?? 0) >= 1 && (

              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Product variants
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    This ranking will affect the variants&apos; order in your
                    storefront.
                  </p>
                </div>
                <div>
                  <div className="grid grid-cols-12 items-center p-3 bg-gray-50 rounded-lg">
                    <div className="col-span-2">
                      <Checkbox
                        // checked={variant.checked}
                        // onCheckedChange={() => toggleVariant(variant.id)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                    </div>
                    {/* <GripVertical className="w-4 h-4 text-gray-400" /> */}
                    <div className="col-span-10 flex justify-evenly items-center">
                      {productOptions.map((variant) => (
                        <div key={variant.id} className="gap-3 ">
                          <span className="text-sm text-gray-900 flex-1">
                            {variant.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="">
                      {variants?.map((variant, id) => (
                        <div
                          key={id}
                          className="grid grid-cols-12 items-center"
                        >
                          <div className="col-span-2 flex items-center gap-2">
                            <div className="col-span-1">
                              <Checkbox
                                // checked={variant.checked}
                                // onCheckedChange={() => toggleVariant(variant.id)}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                            </div>
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="col-span-10 flex justify-evenly items-center">
                            {Object.entries(variant).map(([key, val]) => (
                              <span
                                key={key}
                                className="px-2 py-1 bg-gray-100 rounded"
                              >
                                {val}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          {/* Info Tip */}
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Tip:</span> Variants left unchecked
              won&apos;t be created. You can always create and edit variants
              afterwards but this list fits the variations in your product
              options.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Variants;
