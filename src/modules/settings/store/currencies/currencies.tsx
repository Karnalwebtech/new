"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeander from "@/modules/layout/header/page-heander";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useState } from "react";
import CurrenciesTable from "./currencies-table";
import { NormalPageFooter } from "@/modules/layout/footer/normal-page-footer";
import { useAddCurrencyMutation } from "@/state/store-currency-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";

const Currencies = () => {
  const [step, setStep] = useState<number>(0);
  const [taxMap, setTaxMap] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [addCurrency,{isLoading,isSuccess,error}] = useAddCurrencyMutation();
  const router = useRouter();
  useHandleNotifications({
    error,
    isSuccess,
    successMessage:"Currency added successfully!",
    redirectPath: "/settings/store",
  });
  const onSubmit = useCallback(async () => {
    await addCurrency({ currencies: selected, tax: taxMap });
  }, [selected, taxMap, addCurrency]);
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
          <CurrenciesTable
            selected={selected}
            setSelected={setSelected}
            taxMap={taxMap}
            setTaxMap={setTaxMap}
          />
          <NormalPageFooter
            isLoading={isLoading}
            onCancel={() => router.back()}
            onSubmit={onSubmit}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default memo(Currencies);
