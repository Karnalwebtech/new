"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import Details from "./details";
import PageHeander from "@/modules/layout/header/page-heander";
import Organize from "./organize";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import { useForm } from "react-hook-form";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ProductSchema } from "@/zod-schema/product-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SEOForm from "@/components/forms/SEO-form";
import { useDispatch } from "react-redux";
import { clearSelected } from "@/reducers/healper-slice";
import VariantPriceEditor, {
  PriceRow,
} from "@/components/price-manager/variant-price-editor-dialog";
import { ProductOption } from "./variants/variants";
import InventorytKits, { VariantKitItem } from "./inventoryt-kits";
import Variants2 from "./v2";
import VariantPriceEditor222 from "./v2";

type FormData = z.infer<typeof ProductSchema>;

export function ProductCreateForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [step, setStep] = useState<number>(0);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [kits, setKits] = useState<Record<string, VariantKitItem[]>>({});
  console.log(rows)
  console.log(kits)
  // clear selected on mount
  useEffect(() => {
    dispatch(clearSelected());
  }, [dispatch]);

  // determine whether any variant requires inventory kits
  const isInventoryKits = useMemo(
    () =>
      rows.some(
        (item) =>
          item.has_inventory_kit === true && item.managed_inventory === true
      ),
    [rows]
  );

  // explicit step indexes (helps readability)
  const STEP = {
    DETAILS: 0,
    ORGANIZE: 1,
    VARIANTS: 2,
    KITS: 3, // if applicable
    SEO: 4,
  };

  const lastStep = isInventoryKits ? STEP.SEO : STEP.VARIANTS;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { hasVariants: false },
    resolver: zodResolver(ProductSchema),
  });

  const values = watch();

  const canAccessStep = useMemo(() => {
    // minimal example — extend with more complex validations if needed
    return [true, !!values.title?.trim(), true, true, true];
  }, [values]);

  /* ------------------------ Form submission --------------------------- */

  const onSubmit = useCallback(
    async (data: FormData) => {
      // Build payload
      const productPayload = {
        ...data,
        keywords,
        productOptions,
        variants: rows,
        kits: Object.entries(kits).map(([variantId, options]) => ({
          variantId,
          options: options.map((o) => ({
            id: o.id,
            itemId: o.itemId,
            itemTitle: o.itemTitle,
            quantity: Number(o.quantity) || 0,
          })),
        })),
      };

      // TODO: call API or dispatch action to save productPayload
      // e.g., await api.createProduct(productPayload)
      // For now: console.log dev payload:
      // eslint-disable-next-line no-console
      console.log("Submitting product payload", productPayload);
    },
    [keywords, productOptions, rows, kits]
  );

  /* ------------------------- Step navigation -------------------------- */

  const nextStep = useCallback(
    () => setStep((s) => Math.min(s + 1, lastStep)),
    [lastStep]
  );
  const prevStep = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  return (
    <DialogPopUp
      title="Create Product"
      description="Fill in the details to create a new product."
      isOpen={true}
      handleClose={() => {}}
    >
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden">
        <div className="w-full mx-auto bg-white min-h-screen">
          <PageHeander
            tabs={
              isInventoryKits
                ? ["Details", "Organize", "Variants", "Inventory kits", "SEO"]
                : ["Details", "Organize", "Variants", "SEO"]
            }
            step={step}
            setStep={setStep}
            canAccessStep={canAccessStep}
            onCancel={() => router.back()}
          />

          {step === STEP.DETAILS && (
            <Details
              control={control}
              errors={errors}
              productOptions={productOptions}
              setProductOptions={setProductOptions}
              hasVariant={watch("hasVariants")}
            />
          )}

          {step === STEP.ORGANIZE && (
            <Organize control={control} errors={errors} />
          )}

          {step === STEP.VARIANTS && (
            <div className="w-full">
              <ScrollArea className="h-full w-full rounded-lg border">
                {/* <VariantPriceEditor222 rows={rows} setRows={setRows}/> */}
                <VariantPriceEditor
                  rows={rows}
                  setRows={setRows}
                  productOptions={productOptions}
                />
              </ScrollArea>
            </div>
          )}

          {isInventoryKits && step === STEP.KITS && (
            <div className="h-[70vh] w-full">
              <ScrollArea className="h-full w-full rounded-lg border">
                <InventorytKits variants={rows} kits={kits} setKits={setKits} />
              </ScrollArea>
            </div>
          )}

          {step === (isInventoryKits ? STEP.SEO : STEP.SEO) && (
            <SEOForm
              control={control}
              errors={errors}
              keywords={keywords}
              setKeywords={setKeywords}
              disabled_path={"disabled_path"}
              title={values.meta_title}
              description={values.meta_description}
            />
          )}

          {/* Footer Actions */}
          <PageFooter<FormData>
            step={step}
            lastStep={lastStep}
            canAccessStep={canAccessStep}
            handleNext={nextStep}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isLoading={false}
            onCancel={() => router.back()}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
}
