"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import PageHeander from "@/modules/layout/header/page-heander";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import Details from "./details";
import { useDispatch } from "react-redux";
import FormSkeleton from "@/components/skeletons/form-skeleton";
import { apiKeySchema } from "@/zod-shema/publishable-aPI-key";
import {
  useAddApiKeyMutation,
  useGetApiKeyDetailsQuery,
  useUpdateApiKeyMutation,
} from "@/state/api-key-api";

type FormData = z.infer<typeof apiKeySchema>;
interface Create_api_keysProps {
  ItemId?: string;
  type?: string;
}
const Create_api_keys = ({
  ItemId,
  type = "publishable",
}: Create_api_keysProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = React.useState<number>(0);
  const [addApiKey, { isLoading, error, isSuccess }] = useAddApiKeyMutation();
  const [
    updateApiKey,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateApiKeyMutation();

  const {
    data,
    isLoading: dataLoader,
    error: dataLoadError,
  } = useGetApiKeyDetailsQuery({ id: ItemId as string }, { skip: !ItemId });
  useHandleNotifications({
    error: error || updateError || dataLoadError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: updateSuccess
      ? "Api Key updated successfully!"
      : "Api Key created successfully!",
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
    resolver: zodResolver(apiKeySchema),
  });
  const result = data?.result;
  const values = watch();
  const canAccessStep = useMemo(() => {
    return [
      true,
      !!values.name?.trim(),
      values.name?.trim().length > 0 && values.name?.trim().length <= 60,
    ];
  }, [values]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (ItemId) {
        const res = await updateApiKey({ ...data, id: ItemId, type }).unwrap();
        if (res && res?.result?.id) {
          router.push(`/settings/${type}-api-keys/${res?.result?.id}`);
        }
        return;
      }
      const res = await addApiKey({ ...data, type }).unwrap();
      if (res?.result?.id) {
        router.push(`/settings/${type}-api-keys/${res?.result?.id}`);
      }
    },
    [addApiKey, updateApiKey, ItemId, type, router]
  );

  useEffect(() => {
    if (result) {
      setValue("name", result?.name);
    }
  }, [result, setValue, dispatch]);

  return (
    <DialogPopUp title="" description="" isOpen={true} handleClose={() => {}}>
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden">
        <div className="w-full mx-auto bg-white min-h-screen">
          <PageHeander
            tabs={[]}
            step={step}
            setStep={setStep}
            canAccessStep={[true]}
            onCancel={() => router.back()}
          />
          {dataLoader ? (
            <FormSkeleton />
          ) : (
            <div>
              <Details
                control={control}
                errors={errors}
                title={`${ItemId ? "Update" : "Create"} ${type} API Key`}
                description={`${ItemId ? "Update" : "Create a new"} ${
                  type === "secret"
                    ? "secret API key to access the Medusa API as an authenticated admin user."
                    : "publishable API key to limit the scope of requests to specific sales channels."
                }`}
              />
            </div>
          )}
          <PageFooter<FormData>
            step={step}
            lastStep={0} // or whatever your last step index is
            canAccessStep={canAccessStep} // example: at least 2 steps
            handleNext={() => setStep(step + 1)}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isLoading={isLoading || updateLoading}
            onCancel={() => router.back()}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default Create_api_keys;
