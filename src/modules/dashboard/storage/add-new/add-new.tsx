"use client";
import SelectFields from "@/components/fields/select-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import {
  useAddCloudStorageMutation,
  useGetAllStoragesQuery,
} from "@/state/cloud-storage-api";
import type { CloudStorageForm } from "@/types/cloud-storage-type";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import type { z } from "zod";
import GoogleDriveForm from "./google-drive-form";
import { Cloud, X, Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DrawerComponent } from "@/components/drawer/drawer-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { GoogleDriveFromSchema } from "@/zod-schema/google-drive-schema";

const STORAGE_MODES = [
  { key: "google drive", value: "google drive" },
  { key: "firebase", value: "firebase" },
  { key: "cloudnary", value: "cloudnary" },
];

const StorageHeader = React.memo(({ onClose }: { onClose: () => void }) => (
  <div className="grid grid-cols-12 items-center border-b border-gray-200 bg-white sticky top-0">
    <div className="col-span-2">
      <div className="flex items-center">
        <div className="pr-6 p-2 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <Button variant="secondary" size="sm" className="text-gray-500">
            esc
          </Button>
        </div>
      </div>
    </div>
    <div className="col-span-8">
      <div className="flex justify-center text-center">
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
));

StorageHeader.displayName = "StorageHeader";

const StorageFooter = React.memo(() => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
    <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
      <Button variant="outline">Cancel</Button>
      <Button variant="outline">Save as draft</Button>
      <Button className="bg-gray-900 hover:bg-gray-800">Continue</Button>
    </div>
  </div>
));

StorageFooter.displayName = "StorageFooter";

type FormData = z.infer<typeof GoogleDriveFromSchema>;

export const AddNew = React.memo(() => {
  const router = useRouter();
  const [addCloudStorage, { error, isLoading, isSuccess }] =
    useAddCloudStorageMutation();

  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Storage added successfully.",
    redirectPath: "/dashboard/storage/all",
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(GoogleDriveFromSchema),
  });

  const storageTypeValue = watch("storage_type");

  const queryParams = useMemo(
    () => ({
      rowsPerPage: 1,
      page: 1,
      storage_type: storageTypeValue || undefined,
    }),
    [storageTypeValue]
  );

  const { data: getData } = useGetAllStoragesQuery(queryParams);
  const getSingleData = getData?.result[0];

  useEffect(() => {
    if (
      !getSingleData?.custom_fields ||
      typeof getSingleData.custom_fields !== "object"
    ) {
      return;
    }

    Object.entries(getSingleData.custom_fields).forEach(([key, value]) => {
      if (!(key in GoogleDriveFromSchema.shape)) return;

      // Skip null/objects
      if (value === null || typeof value === "object") return;

      // Coerce non-string primitives to string
      const str = typeof value === "string" ? value : String(value);

      setValue(key as FieldPath<FormData>, str, {
        shouldValidate: false,
        shouldDirty: false,
      });
    });
  }, [getSingleData?.custom_fields, setValue]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      console.log("Form Data Submitted: ", data);
      const payload = {
        data,
        storage_type: data?.storage_type,
      } as CloudStorageForm;

      await addCloudStorage(payload);
    },
    [addCloudStorage]
  );

  const handleClose = useCallback(() => {
    router.push("/dashboard/storage");
  }, [router]);

  const formContent = useMemo(
    () => (
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
                drop_down_selector={STORAGE_MODES}
              />
            </div>
          </div>
          <div>
            {storageTypeValue === "google drive" && (
              <GoogleDriveForm control={control} errors={errors} />
            )}
          </div>
        </CardContent>
      </Card>
    ),
    [control, errors, storageTypeValue]
  );

  return (
    <DrawerComponent
      title="Create Product"
      description="Fill in the details to create a new product."
      isOpen={true}
      handleClose={handleClose}
    >
      <ScrollArea className="h-[97vh] w-full p-0">
        <div className="w-full mx-auto bg-white min-h-screen">
          <StorageHeader onClose={handleClose} />
          <div className="p-2 mb-20 lg:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {formContent}
              <StorageFooter />
            </form>
          </div>
        </div>
      </ScrollArea>
    </DrawerComponent>
  );
});

AddNew.displayName = "AddNew";
