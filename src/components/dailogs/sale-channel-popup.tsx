"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import React, { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import PageHeander from "@/modules/layout/header/page-heander";
import { NormalPageFooter } from "@/modules/layout/footer/normal-page-footer";
import SalesChannels from "@/modules/settings/sales-channels/sales-channels";
// import CountryStateCityTable from "./country-state-city-table";

interface SaleChannelPopupProps {
    isOpen?: boolean;
    setIsOpen?: (value: boolean) => void;
    isChild?: boolean;
    //   isTaxPrice?: boolean;
}
const SaleChannelPopup = ({
    isOpen = true,
    setIsOpen,
    isChild = false,
}: SaleChannelPopupProps) => {
    const [step, setStep] = useState<number>(0);
    // const dispatch = useDispatch();
    const { selected } = useSelector((state: RootState) => state.helper);

    // const [addCurrency, { isLoading, isSuccess, error }] =
    //   useAddCurrencyMutation();
    const router = useRouter();
    // useHandleNotifications({
    //   error,
    //   isSuccess,
    //   successMessage: "Currency added successfully!",
    //   redirectPath: "/settings/store",
    // });
    const onSubmit = useCallback(async () => {
        // await addCurrency({ CountryStateCity: selected});
    }, []);

    // useEffect(() => {
    //   if (isSuccess) {
    //     dispatch(clearTaxMap());
    //     dispatch(clearSelected());
    //   }
    // }, [dispatch, isSuccess]);

    const closeHandler = useCallback(() => {
        if (selected.length === 0) {
            toast.warning("Please select one");
            return;
        }
        setIsOpen?.(false);
    }, [setIsOpen, selected]);

    return (
        <DialogPopUp
            title="Add CountryStateCity"
            description="Add CountryStateCity for your store"
            isOpen={isOpen}
            handleClose={() => { }}
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
                  <SalesChannels isChild={true} />
                    <NormalPageFooter
                        isLoading={false}
                        onCancel={() => (isChild ? setIsOpen?.(!isOpen) : router.back())}
                        onSubmit={() => (isChild ? closeHandler() : onSubmit())}
                    />
                </div>
            </ScrollArea>
        </DialogPopUp>
    );
};

export default memo(SaleChannelPopup);
