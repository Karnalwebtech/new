import ButtonEvent from "@/components/buttons/btn-event";
import SelectFields from "@/components/fields/select-field";
import SwitchField from "@/components/fields/switch-field";
import SaleChannelPopup from "@/components/dailogs/sale-channel-popup";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useGetProductCategoryQuery } from "@/state/product-category-api";
import { useGetProductCollectionsQuery } from "@/state/product-collections-api";
import { useGetAllProductTagDataQuery } from "@/state/product-tag-api";
import { useGetAllProductTypeDataQuery } from "@/state/product-types-api";
import { useGetAllShippingProfileDataQuery } from "@/state/shipping-profile-api";
import React, { useMemo, useState } from "react";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useGetAllSalesChannelsDataQuery } from "@/state/sales-channels-api";
import SelectedItemsBadgeList from "@/components/selected-items-badge-list";
interface OrganizeProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
}
const Organize = <T extends FieldValues>({
  control,
  errors,
}: OrganizeProps<T>) => {
  const { selected } = useSelector((state: RootState) => state.helper);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isLoading, error } = useGetAllSalesChannelsDataQuery({
    rowsPerPage: 100,
    page: 1,
  });
  const { data: typeFetchData, } = useGetAllProductTypeDataQuery({
    rowsPerPage: 100,
    page: 1,
  });

  const { data: collectionData } = useGetProductCollectionsQuery({
    rowsPerPage: 100,
    page: 1,
  });
  const { data: categoryData } = useGetProductCategoryQuery({
    rowsPerPage: 100,
    page: 1,
  });
  const { data: tagData } = useGetAllProductTagDataQuery({
    rowsPerPage: 100,
    page: 1,
  });
  const { data: shippingProfileData } = useGetAllShippingProfileDataQuery({
    rowsPerPage: 100,
    page: 1,
  });
  const typeResult = useMemo(() => typeFetchData?.result || [], [typeFetchData?.result]);
  const collectionResult = useMemo(() => collectionData?.result || [], [collectionData?.result]);
  const categoryResult = useMemo(() => categoryData?.result || [], [categoryData?.result]);
  const tagResult = useMemo(() => tagData?.result || [], [tagData?.result]);
  const shippingResult = useMemo(() => shippingProfileData?.result || [], [shippingProfileData?.result]);

  return (
    <div className="p-8 pb-32 max-w-[800px] m-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-8">Organize</h2>
      <div className="space-y-8">
        {/* Title, Subtitle, Handle Row */}

        <div className="shadow-md bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <SwitchField control={control} errors={errors} name={"discountable" as Path<T>} />
            <div className="space-y-1">
              <Label
                htmlFor="discountable"
                className="text-sm font-medium text-gray-700"
              >
                Discountable
                <span className="text-xs pl-2 text-gray-500">Optional</span>
              </Label>
              <p className="text-sm text-gray-600">
                When unchecked, discounts will not be applied to this product
              </p>
            </div>
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
              name={"type" as Path<T>}
              placeholder="Select type" // Default placeholder
              drop_down_selector={typeResult.map(({ _id, name }) => ({
                key: _id || "",
                value: name || "",
              }))}

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
              name={"collection" as Path<T>}
              placeholder="Select collection" // Default placeholder
              drop_down_selector={collectionResult.map(({ name, _id }) => ({
                key: _id || "",
                value: name || "",
              }))}

              class_style={"text-gray-500"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categorie" className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-700">
                Categories
              </span>
              <span className="text-xs text-gray-500">Optional</span>
            </Label>
            <SelectFields
              control={control}
              errors={errors}
              name={"categorie" as Path<T>}
              placeholder="Select categories" // Default placeholder
              drop_down_selector={categoryResult.map(({ name, _id }) => ({
                key: _id || "",
                value: name || "",
              }))}

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
              name={"tags" as Path<T>}
              placeholder="Select tags" // Default placeholder
              drop_down_selector={tagResult.map(({ name, _id }) => ({
                key: _id || "",
                value: name || "",
              }))}
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
              name={"shipping_profile" as Path<T>}
              placeholder="Select shipping profile" // Default placeholder
              drop_down_selector={shippingResult.map(({ name, _id }) => ({
                key: _id || "",
                value: name || "",
              }))}
              class_style={"text-gray-500"}
            />
          </div>
        </div>
        <div>
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

              <div className="flex justify-end">
                <ButtonEvent
                  title="Add "
                  event={() => setIsOpen(true)}
                // style="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow px-4 py-2 transition"
                />
              </div>
            </div>
          </div>
          <SelectedItemsBadgeList />
        </div>
      </div>
      <SaleChannelPopup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isChild={true}
      />
    </div>
  );
};
export default Organize;
