"use client";

import React, { useMemo } from "react";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAllInventoryQuery } from "@/state/inventory-api";
import SelectFields from "@/components/fields/select-field";
import { useGetAllStockLocationQuery } from "@/state/stock-location-api";
import InputField from "@/components/fields/input-field";
import TextareaField from "@/components/fields/textarea-field";
import { InventoryType } from "@/types/inventory-type";

interface DetailsProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  title?: string;
  description?: string;
  values?: Partial<T>;
}

const Details = <T extends FieldValues>({
  control,
  errors,
  title = "reservation",
  description,
  values,
}: DetailsProps<T>) => {
  const { data, isLoading, error } = useGetAllInventoryQuery({
    rowsPerPage: 100,
    page: 1,
  });
  const { data: locationData } = useGetAllStockLocationQuery({
    rowsPerPage: 100,
    page: 1,
  });
  const result = useMemo(() => data?.result || [], [data?.result]);
  const locationDataResult = useMemo(
    () => locationData?.result || [],
    [locationData?.result]
  );
  const reserve = values?.reserve;
  const location = values?.location;
  const quantity = values?.quantity;
  const reserveDetails: InventoryType | undefined = result.find(
    (item) => item._id === reserve
  );
  const locationDetails =
    reserveDetails?.inventory_levels_preview?.find(
      (item) => item?.location_id === location
    ) ?? null;

  console.log(location);
  console.log(locationDetails);
  return (
    <div className="p-8 pb-22 max-w-[800px] m-auto">
      <div className="p-8">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mb-6">{description}</p>
        )}

        {/* Top row: Item + Location selects */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="mb-2">Item to reserve</Label>
            <SelectFields
              control={control}
              errors={errors}
              name={"reserve" as Path<T>}
              placeholder="Select reserve"
              drop_down_selector={result.map(({ _id, title }) => ({
                key: _id!,
                value: title!,
              }))}
              is_loading={isLoading}
              is_disabled={false}
            />
          </div>

          <div>
            <Label className="mb-2">Location</Label>
            <SelectFields
              control={control}
              errors={errors}
              name={"location" as Path<T>}
              placeholder="Select location"
              drop_down_selector={locationDataResult.map(({ _id, name }) => ({
                key: _id!,
                value: name!,
              }))}
              is_loading={isLoading}
              is_disabled={!reserve}
            />
          </div>
        </div>

        {/* Info card: Title / SKU / In stock / Available */}
        <Card className="mb-6 border">
          <CardContent className="p-0">
            <table className="w-full text-sm table-fixed border-collapse">
              <tbody>
                <tr className="border-b last:border-b-0">
                  <td className="px-4 py-3 text-muted-foreground">Title</td>
                  <td className="px-4 py-3">{reserveDetails?.title || "-"}</td>
                </tr>

                <tr className="border-b last:border-b-0">
                  <td className="px-4 py-3 text-muted-foreground">SKU</td>
                  <td className="px-4 py-3">{reserveDetails?.sku || "-"}</td>
                </tr>

                <tr className="border-b last:border-b-0">
                  <td className="px-4 py-3 text-muted-foreground">In stock</td>
                  <td className="px-4 py-3">
                    {locationDetails?.stocked_quantity || "-"}
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-3 text-muted-foreground">Available</td>
               <td className="px-4 py-3">
  {(locationDetails?.stocked_quantity ?? 0) - (quantity ?? 0)}
</td>

                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 mb-4">
            <Label
              htmlFor="quantity"
              className="text-sm font-medium text-gray-700"
            >
              Quantity
            </Label>
            <InputField
              control={control}
              errors={errors}
              disabled_path={!location}
              name={"quantity" as Path<T>}
              type={"number"}
              placeholder="0"
              inputStyle={"placeholder-gray-200 bg-transparent border-zinc-300"}
            />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Description <span className="text-gray-300">Optional</span>
          </Label>
          <TextareaField
            control={control}
            errors={errors}
            disabled_path={!location}
            name={"description" as Path<T>}
            inputStyle={"placeholder-gray-200 bg-transparent border-zinc-300"}
          />
        </div>
      </div>
    </div>
  );
};

export default Details;
