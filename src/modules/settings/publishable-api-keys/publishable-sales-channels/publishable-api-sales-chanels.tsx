"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeander from "@/modules/layout/header/page-heander";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useState } from "react";
import { NormalPageFooter } from "@/modules/layout/footer/normal-page-footer";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { clearSelected } from "@/reducers/healper-slice";
import { toast } from "sonner";
import PublishableApiSalesChanelsTable from "./publishable-api-sales-chanels-table";
import { useAddPublishableApiKeyMutation } from "@/state/publishable-api-key-api";
interface PublishableApiSalesChanelsProps {
  pageId?: string;
}
const PublishableApiSalesChanels = ({
  pageId,
}: PublishableApiSalesChanelsProps) => {
  const [step, setStep] = useState<number>(0);
  const dispatch = useDispatch();
  const { selected } = useSelector((state: RootState) => state.helper);
  const [addPublishableApiKey, { isLoading, isSuccess, error }] =
    useAddPublishableApiKeyMutation();
  const router = useRouter();
  useHandleNotifications({
    error,
    isSuccess,
    successMessage: "Publishable api key added successfully!",
    redirectPath: `/settings/publishable-api-keys/${pageId}`,
  });
  const onSubmit = useCallback(async () => {}, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearSelected());
    }
  }, [dispatch, isSuccess]);

  const formHandler = useCallback(async() => {
    if (selected.length === 0) {
      toast.warning("Please select one");
      return;
    }

    await addPublishableApiKey({ id: pageId!, salesId: selected });
  }, [selected, pageId, addPublishableApiKey]);

  return (
    <DialogPopUp
      title="Add Currencies"
      description="Add Currencies for your store"
      isOpen={true}
      handleClose={() => {}}
    >
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden">
        {/* {dataFetchLoading ? (
          <FormSkeleton />
        ) : ( */}
        <div className="w-full mx-auto bg-white min-h-screen">
          <PageHeander
            tabs={[]}
            step={step}
            setStep={setStep}
            canAccessStep={[true]}
            onCancel={() => router.back()}
          />
          <PublishableApiSalesChanelsTable pageId={pageId}/>
          <NormalPageFooter
            isLoading={isLoading}
            onCancel={() => router.back()}
            onSubmit={() => (true ? formHandler() : onSubmit())}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default memo(PublishableApiSalesChanels);
