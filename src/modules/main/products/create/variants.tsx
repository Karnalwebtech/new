"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

const Variants = () => {
  const [hasVariants, setHasVariants] = useState(false);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Variants</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
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
    </div>
  );
};

export default Variants;
