import SelectFields from "@/components/fields/select-field";
import SwitchField from "@/components/fields/switch-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
interface OrganizeProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
}
const Organize = <T extends FieldValues>({
  control,
  errors,
}: OrganizeProps<T>) => {
  return (
    <div className="p-8 pb-32 max-w-[800px] m-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-8">Organize</h2>
      <div className="space-y-8">
        {/* Title, Subtitle, Handle Row */}
        <div className="grid grid-cols-12 gap-6 bg-gray-50 p-2 rounded-lg border-2 border-gray-200">
          <div className="col-span-1">
            <SwitchField
              control={control}
              errors={errors}
              name={"discountable" as Path<T>}
            />
          </div>
          <div className="col-span-11">
            <div className="flex gap-2 items-center">
              <Label
                htmlFor="discountable"
                className="text-sm font-medium text-gray-700"
              >
                Discountable
              </Label>
              <span className="text-xs text-gray-500">Optional</span>
            </div>
            <p className="text-sm text-gray-500">
              When unchecked, discounts will not be applied to this product
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="type" className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-700">Type</span>
              <span className="text-xs text-gray-500">Optional</span>
            </Label>
            <SelectFields
              control={control}
              errors={errors}
              name={"status" as Path<T>}
              placeholder="Select status" // Default placeholder
              drop_down_selector={[
                {
                  key: "active",
                  value: "active",
                },
                {
                  key: "inactive",
                  value: "inactive",
                },
              ]}
              class_style={"text-gray-500"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection" className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-700">
                Collection
              </span>
              <span className="text-xs text-gray-500">Optional</span>
            </Label>
            <SelectFields
              control={control}
              errors={errors}
              name={"status" as Path<T>}
              placeholder="Select status" // Default placeholder
              drop_down_selector={[
                {
                  key: "active",
                  value: "active",
                },
                {
                  key: "inactive",
                  value: "inactive",
                },
              ]}
              class_style={"text-gray-500"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categories" className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-700">
                Categories
              </span>
              <span className="text-xs text-gray-500">Optional</span>
            </Label>
            <SelectFields
              control={control}
              errors={errors}
              name={"status" as Path<T>}
              placeholder="Select status" // Default placeholder
              drop_down_selector={[
                {
                  key: "active",
                  value: "active",
                },
                {
                  key: "inactive",
                  value: "inactive",
                },
              ]}
              class_style={"text-gray-500"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags" className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-700">Tags</span>
              <span className="text-xs text-gray-500">Optional</span>
            </Label>
            <SelectFields
              control={control}
              errors={errors}
              name={"status" as Path<T>}
              placeholder="Select status" // Default placeholder
              drop_down_selector={[
                {
                  key: "active",
                  value: "active",
                },
                {
                  key: "inactive",
                  value: "inactive",
                },
              ]}
              class_style={"text-gray-500"}
            />
          </div>
          <div className="">
            <Label
              htmlFor="shipping-profile"
              className="flex gap-2 items-center"
            >
              <span className="text-sm font-medium text-gray-700">
                Shipping profile
              </span>
              <span className="text-xs text-gray-500">Optional</span>
            </Label>
            <p className="text-sm text-gray-500">
              Connect the product to a shipping profile
            </p>
          </div>
          <div className="space-y-2">
            <SelectFields
              control={control}
              errors={errors}
              name={"status" as Path<T>}
              placeholder="Select status" // Default placeholder
              drop_down_selector={[
                {
                  key: "active",
                  value: "active",
                },
                {
                  key: "inactive",
                  value: "inactive",
                },
              ]}
              class_style={"text-gray-500"}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9">
            <Label
              htmlFor="shipping-profile"
              className="flex gap-2 items-center"
            >
              <span className="text-sm font-medium text-gray-700">
                Sales channels
              </span>
              <span className="text-xs text-gray-500">Optional</span>
            </Label>
            <p className="text-sm text-gray-500">
              This product will only be available in the default sales channel
              if left untouched.
            </p>
          </div>
          <div className="col-span-3 text-end">
            <Button>Add</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Organize;
