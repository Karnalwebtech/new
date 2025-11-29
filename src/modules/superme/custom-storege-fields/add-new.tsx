"use client"
import RenderCustomField from "@/components/custom-fiels/render-custom-field";
import SelectFields from "@/components/fields/select-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCustomFieldQuery } from "@/state/custom-field-api";
import { generateDynamicSchema } from "@/zod-schema/custom-field-schema";
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
  const [storageFieldtype, setStorageFieldtype] = useState<string | null>(null)
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
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(MergedSchema),
  });
  const onSubmit = useCallback(async (data: FormData) => {
    console.log(data)
  }, []);
  // Watch for storage_type changes
  const storageTypeValue = watch("storage_type");

  useEffect(() => {
    setStorageFieldtype(storageTypeValue);
  }, [storageTypeValue]);

  return (
    <>

      <div className="p-2 lg:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                Add new custom storage fields
              </CardTitle>
            </CardHeader>
            <CardContent >
              <div className="grid gap-4 grid-cols-2">


                <SelectFields
                  control={control}
                  errors={errors}
                  label="Storage type"
                  name="storage_type"
                  drop_down_selector={INSURANCE_PAYMENT_MODES}
                />

                {storageFieldtype &&
                  <RenderCustomField
                    control={control}
                    errors={errors}
                    name="exampleField"
                    storageFieldtype={storageFieldtype}
                    pageId={"custom-storage-fields"}
                    search_type={"global"}
                  />
                }
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">submit</Button>
            </CardFooter>
          </Card>
        </form >
      </div>
    </>
  );
};
