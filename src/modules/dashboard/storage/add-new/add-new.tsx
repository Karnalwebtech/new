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
import {
  useAddCloudStorageMutation,
  useGetAllStoragesQuery,
} from "@/state/cloud-storage-api";
import { useGetCustomFieldQuery } from "@/state/custom-field-api";
import { CloudStorageForm } from "@/types/cloud-storage-type";
import { generateDynamicSchema } from "@/zod-shema/custom-field-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import GoogleDriveForm from "./google-drive-form";
import { Cloud, X, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DrawerComponent } from "@/components/drawer/drawer-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { GoogleDriveFromSchema } from "@/zod-shema/google-drive-schema";
const INSURANCE_PAYMENT_MODES = [
  { key: "google drive", value: "google drive" },
  { key: "firebase", value: "firebase" },
  { key: "cloudnary", value: "cloudnary" },
];

const StorageFormSchema = z.object({
  storage_type: z.string({ message: "required" }),
});

export const AddNew = () => {
  const router = useRouter();
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

  // type FormData = z.infer<typeof MergedSchema>;
  type FormData = z.infer<typeof GoogleDriveFromSchema>;
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(GoogleDriveFromSchema),
     defaultValues: {
      auth_token_uri: "",
      auth_uri: "",
      client_id: "",
      client_email: "",
      private_key: "",
      private_id_key: "",
      private_id: "",
      type: "service_account",
      drive_folder: "",
      metadata_api: "",
      api: "",
      // storage_type only if you have it in a different schema
    },
  });

  // Watch for storage_type changes
  const storageTypeValue = watch("storage_type");

  const { data: getData } = useGetAllStoragesQuery({
    rowsPerPage: 1,
    page: 1,
    storage_type: storageFieldtype,
  });
  const getSingleData = getData?.result[0];
  // useEffect(() => {
  //   setStorageFieldtype(storageTypeValue);
  // }, [storageTypeValue]);

  // useEffect(() => {
  //   if (!getSingleData) return;
  //   if (
  //     getSingleData.custom_fields &&
  //     typeof getSingleData.custom_fields === "object"
  //   ) {
  //     Object.entries(getSingleData.custom_fields).forEach(([key, value]) => {
  //       setValue(key, value);
  //     });
  //   }
  // }, [getSingleData, setValue]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      console.log("Form Data Submitted: ", data);
      // const customFieldData: Record<
      //   string,
      //   string | number | boolean | string[]
      // > = Object.keys(data)
      //   .filter((key) => !(key in StorageFormSchema.shape)) // Exclude predefined schema fields
      //   .reduce((acc, key) => {
      //     acc[key] = data[key as keyof FormData];
      //     return acc;
      //   }, {} as Record<string, string | number | boolean | string[]>);
      // const payload: CloudStorageForm = {
      //   storage_type: data.storage_type,
      //   customFields: customFieldData || {}, // Handle optional fields
      // };
      // await addCloudStorage(payload);
    },
    [addCloudStorage]
  );

  return (
    <>
      <DrawerComponent
        title="Create Product"
        description="Fill in the details to create a new product."
        isOpen={true}
        handleClose={() => {}}
      >
        <ScrollArea className="h-[97vh] w-full p-0">
          <div className="w-full mx-auto bg-white min-h-screen">
            {/* Header */}
            <div className="grid grid-cols-12 items-center border-b border-gray-200 bg-white sticky top-0">
              <div className="col-span-2">
                <div className="flex items-center">
                  <div className="pr-6 p-2 flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push("/dashboard/storage")}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-gray-500"
                    >
                      esc
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-span-8">
                <div className="flex justify-center text-center">
                  {" "}
                  <div className="text-center py-2">
                    <h1 className="text-2xl font-bold text-foreground">
                      Storage Configuration
                    </h1>
                    <p className="text-muted-foreground">
                      Configure your custom storage settings with ease
                    </p>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
            <div className="p-2 mb-20 lg:p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Card className="w-full max-w-4xl mx-auto">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">
                          Add Storage Details
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Configure your storage provider settings
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="w-[300px]">
                      <div className="space-y-2">
                        <Label
                          htmlFor="storage-type"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <Cloud className="h-4 w-4 text-primary" />
                          Storage Type
                        </Label>
                        <SelectFields
                          control={control}
                          errors={errors}
                          label=""
                          name="storage_type"
                          drop_down_selector={INSURANCE_PAYMENT_MODES}
                        />
                      </div>
                    </div>
                    <div>
                      {storageTypeValue === "google drive" && (
                        <GoogleDriveForm 
                         control={control}
                          errors={errors}
                          // name="exampleField"
                        />
                      )}
                      {/* {storageFieldtype && (
                        <RenderCustomField
                          control={control}
                          errors={errors}
                          name="exampleField"
                          storageFieldtype={storageFieldtype}
                          pageId={"custom-storage-fields"}
                          search_type={"global"}
                          isNotVisiableBtn={false}
                        />
                      )} */}
                    </div>
                  </CardContent>
                </Card>
            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button variant="outline">Save as draft</Button>
                <Button className="bg-gray-900 hover:bg-gray-800">
                  Continue
                </Button>
              </div>
            </div>
              </form>
            </div>
          </div>
        </ScrollArea>
      </DrawerComponent>
    </>
  );
};
