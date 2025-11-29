"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeander from "@/modules/layout/header/page-heander";
import React, { memo, useState } from "react";
import ConditionalPricesManager from "./conditional-prices-manager";
import { NormalPageFooter } from "@/modules/layout/footer/normal-page-footer";

interface PriceManagerDialogProps {
  isOpen?: boolean;
  setIsOpen?: (value: boolean) => void;
  keyValue: { key: string; name: string };
}
const PriceManagerDialog = ({
  isOpen = false,
  setIsOpen,
  keyValue,
}: PriceManagerDialogProps) => {
  const [step, setStep] = useState<number>(0);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(clearTaxMap());
  //   dispatch(clearSelected());
  // }, [dispatch]);

  // const { taxMap, selected } = useSelector((state: RootState) => state.helper);

  // const { data } = useGetAllStoreCurrenciesQuery({
  //   rowsPerPage: 500,
  //   page: 1,
  // });

  // const [addCurrency, { isLoading, isSuccess, error }] =
  //   useAddCurrencyMutation();
  // const router = useRouter();
  // useHandleNotifications({
  //   error,
  //   isSuccess,
  //   successMessage: "Currency added successfully!",
  //   redirectPath: "/settings/store",
  // });
  // const result = useMemo(() => data?.result || [], [data?.result]);

  // useEffect(() => {
  //   if (!result || result.length === 0) return;

  //   // Extract valid currency codes
  //   const codes = result.map((item) => item.currency_id?.code).filter(Boolean); // removes undefined/null

  //   // Extract tax toggles
  //   const taxList = result
  //     .map((item) => ({
  //       code: item.currency_id?.code,
  //       checked: item.tax_inclusive,
  //     }))
  //     .filter((item) => item.code); // only valid codes

  //   // Apply tax map
  //   taxList.forEach((t) => {
  //     dispatch(toggleTax({ code: t.code, checked: t.checked }));
  //   });

  //   // Select currencies in bulk
  //   dispatch(
  //     bulkToggleIsDisabled({
  //       codes,
  //       checked: true,
  //     })
  //   );
  // }, [result, dispatch]);

  // const onSubmit = useCallback(async () => {
  //   await addCurrency({ currencies: selected, tax: taxMap });
  // }, [selected, taxMap, addCurrency]);

  // useEffect(() => {
  //   if (isSuccess) {
  //     dispatch(clearTaxMap());
  //     dispatch(clearSelected());
  //   }
  // }, [dispatch, isSuccess]);

  // const closeHandler = useCallback(() => {
  //   if (selected.length === 0) {
  //     toast.warning("Please select one");
  //     return;
  //   }
  //   setIsOpen?.(false);
  // }, [setIsOpen, selected]);

  return (
    <DialogPopUp
      title="Add Currencies"
      description="Add Currencies for your store"
      isOpen={isOpen}
      handleClose={() => {}}
    >
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden">
        <div className="w-full mx-auto bg-white min-h-screen">
          <PageHeander
            tabs={[]}
            step={step}
            setStep={setStep}
            canAccessStep={[true]}
            onCancel={() => setIsOpen?.(!isOpen)}
          />
          <ConditionalPricesManager
            currencyKey={keyValue?.key}
            name={keyValue?.name}
          />
          <NormalPageFooter
            isLoading={false}
            onCancel={() => setIsOpen?.(!isOpen)}
            onSubmit={() => setIsOpen?.(!isOpen)}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default memo(PriceManagerDialog);
