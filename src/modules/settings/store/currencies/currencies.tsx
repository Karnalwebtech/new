"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeander from "@/modules/layout/header/page-heander";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useMemo, useState } from "react";
import CurrenciesTable from "./currencies-table";
import { NormalPageFooter } from "@/modules/layout/footer/normal-page-footer";
import {
  useEditCurrencyMutation,
  useGetAllCurrenciesQuery,
} from "@/state/currency-api";

const Currencies = () => {
  const [step, setStep] = useState<number>(0);
  const [taxMap, setTaxMap] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const [EditCurrency] = useEditCurrencyMutation();
  // Normalize data once
  const { data, isLoading } = useGetAllCurrenciesQuery({
    rowsPerPage: 10,
    page: 10,
  });
  const allCurrencies = useMemo(() => data?.result || [], [data]);

  const onSubmit = useCallback(async () => {
    const newData = allCurrencies
      .map((currency) => ({
        ...currency,
        digits: currency.digits || 2,
        number: currency.number || "000",
        tax_inclusive_pricing: taxMap[currency.code] || false, // Default to false if not set
      }))
      .filter((currency) => selected.includes(currency.code));
    console.log(newData, "newData");
    await EditCurrency(newData);
  }, [selected, taxMap, allCurrencies, EditCurrency]);
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
            isLoading={false}
            onCancel={() => router.back()}
            onSubmit={onSubmit}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default memo(Currencies);
