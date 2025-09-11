"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeander from "@/modules/layout/header/page-heander";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useEffect, useState } from "react";
import CurrenciesTable from "./currencies-table";
import { NormalPageFooter } from "@/modules/layout/footer/normal-page-footer";
import { useAddCurrencyMutation } from "@/state/store-currency-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { clearSelected, clearTaxMap } from "@/reducers/healper-slice";

interface CurrenciesProps {
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
  isChild?: boolean;
  isTaxPrice?:boolean;
}
const Currencies = ({
  isOpen = true,
  setIsOpen,
  isChild = false,
  isTaxPrice=true
}: CurrenciesProps) => {
  const [step, setStep] = useState<number>(0);
  const dispatch = useDispatch();
  const { taxMap, selected } = useSelector((state: RootState) => state.helper);
  const [addCurrency, { isLoading, isSuccess, error }] =
    useAddCurrencyMutation();
  const router = useRouter();
  useHandleNotifications({
    error,
    isSuccess,
    successMessage: "Currency added successfully!",
    redirectPath: "/settings/store",
  });
  const onSubmit = useCallback(async () => {
    await addCurrency({ currencies: selected, tax: taxMap });
  }, [selected, taxMap, addCurrency]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearTaxMap());
      dispatch(clearSelected());
    }
  }, [dispatch, isSuccess]);
  return (
    <DialogPopUp
      title="Add Currencies"
      description="Add Currencies for your store"
      isOpen={isOpen}
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
            onCancel={() => (isChild ? setIsOpen?.(!isOpen) : router.back())}
          />
          <CurrenciesTable isTaxPrice={isTaxPrice}/>
          <NormalPageFooter
            isLoading={isLoading}
            onCancel={() => (isChild ? setIsOpen?.(!isOpen) : router.back())}
            onSubmit={onSubmit}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default memo(Currencies);
