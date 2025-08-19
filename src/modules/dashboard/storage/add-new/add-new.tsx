"use client";
import { GeneralBtn } from "@/components/buttons/general-btn";
import RenderCustomField from "@/components/custom-fiels/render-custom-field";
import SelectFields from "@/components/fields/select-field";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useAddCloudStorageMutation, useGetAllStoragesQuery } from "@/state/cloud-storage-api";
import { useGetCustomFieldQuery } from "@/state/custom-field-api";
import { CloudStorageForm } from "@/types/cloud-storage-type";
import { generateDynamicSchema } from "@/zod-shema/custom-field-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const INSURANCE_PAYMENT_MODES = [
  { key: "google drive", value: "google drive" },
  { key: "firebase", value: "firebase" },
  { key: "cloudnary", value: "cloudnary" },
];

const StorageFormSchema = z.object({
  storage_type: z.string({ message: "required" }),
});

export const AddNew = () => {



  const [storageFieldtype, setStorageFieldtype] = useState<string | null>(null);
  const [addCloudStorage, { error, isLoading, isSuccess }] =
    useAddCloudStorageMutation();

  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Storage added succesfuly.",
    redirectPath: "/dashboard/storage/all",
  });
  const { data } = useGetCustomFieldQuery({
    page_id: "custom-storage-fields",
    rowsPerPage: 100,
    page: 1,
    field_type: storageFieldtype && storageFieldtype,
    search_type: "global",
  });
  const customFields = useMemo(() => data?.result || [], [data]);
  const DynamicFormSchema = generateDynamicSchema(customFields);
  // Merge `PolicySchema` with `DynamicFormSchema`
  const MergedSchema = StorageFormSchema.merge(DynamicFormSchema);

  type FormData = z.infer<typeof MergedSchema>;
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(MergedSchema),
  });

  // Watch for storage_type changes
  const storageTypeValue = watch("storage_type");

  const { data: getData } =
    useGetAllStoragesQuery({
      rowsPerPage: 1,
      page: 1,
      storage_type: storageFieldtype,
    });
  const getSingleData = getData?.result[0]
  useEffect(() => {
    setStorageFieldtype(storageTypeValue);
  }, [storageTypeValue]);

  useEffect(() => {
    if (!getSingleData) return;
    if (getSingleData.custom_fields && typeof getSingleData.custom_fields === "object") {
      Object.entries(getSingleData.custom_fields).forEach(([key, value]) => {
        setValue(key, value)
      });
    }
  }, [getSingleData, setValue])

  const onSubmit = useCallback(
    async (data: FormData) => {
      const customFieldData: Record<
        string,
        string | number | boolean | string[]
      > = Object.keys(data)
        .filter((key) => !(key in StorageFormSchema.shape)) // Exclude predefined schema fields
        .reduce((acc, key) => {
          acc[key] = data[key as keyof FormData];
          return acc;
        }, {} as Record<string, string | number | boolean | string[]>);
      const payload: CloudStorageForm = {
        storage_type: data.storage_type,
        customFields: customFieldData || {}, // Handle optional fields
      };
      await addCloudStorage(payload);
    },
    [addCloudStorage]
  );

  return (
    <>
      <div className="p-2 lg:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Add new custom storage fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2">
                <SelectFields
                  control={control}
                  errors={errors}
                  label="Storage type"
                  name="storage_type"
                  drop_down_selector={INSURANCE_PAYMENT_MODES}
                />

                {storageFieldtype && (
                  <RenderCustomField
                    control={control}
                    errors={errors}
                    name="exampleField"
                    storageFieldtype={storageFieldtype}
                    pageId={"custom-storage-fields"}
                    search_type={"global"}
                    isNotVisiableBtn={false}
                  />
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <GeneralBtn title={"Submit"} type={"submit"} loader={isLoading} style={"w-[120px]"} />
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
};
