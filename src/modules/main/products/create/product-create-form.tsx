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
import { useDispatch, useSelector } from "react-redux";
import { clearSelected } from "@/reducers/healper-slice";
import VariantPriceEditor, {
  PriceRow,
} from "@/components/price-manager/variant-price-editor-dialog";
import Variants, { ProductOption } from "./variants/variants";
import InventorytKits, { VariantKitItem } from "./inventoryt-kits";
import { useAddProductMutation } from "../../../../state/product-api";
import { RootState } from "@/store";
import Media from "./media";
import { Label } from "@/components/ui/label";
import SwitchField from "@/components/fields/switch-field";

/* ----------------------------- Types ------------------------------ */

type FormData = z.infer<typeof ProductSchema>;

/* ----------------------------- Steps ------------------------------ */

const STEP = {
  DETAILS: 0,
  ORGANIZE: 1,
  VARIANTS: 2,
  KITS: 3,
  SEO: 4,
} as const;

/* ---------------------- Component ------------------------ */

export function ProductCreateForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const files = useSelector((state: RootState) => state.files.files);
  const selected_sales_channels = useSelector(
    (state: RootState) => state.helper.selected
  );

  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [step, setStep] = useState<number>(STEP.DETAILS);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [kits, setKits] = useState<Record<string, VariantKitItem[]>>({});
  const [isThumbnail, setIsThumbnail] = useState<string>("");
  /* 🔒 Lock inventory-kit flow */
  const [flowHasKits, setFlowHasKits] = useState(false);

  const [addProduct] = useAddProductMutation();

  useEffect(() => {
    dispatch(clearSelected());
  }, [dispatch]);

  /* ------------------- Decide once after variants ------------------- */

  useEffect(() => {
    if (step === STEP.VARIANTS) {
      const hasKits = rows.some(
        (r) => r.has_inventory_kit && r.managed_inventory
      );
      setFlowHasKits(hasKits);
    }
  }, [rows, step]);

  /* ------------------------- Form -------------------------- */

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { hasVariants: false },
    resolver: zodResolver(ProductSchema),
  });

  const values = watch();

  /* ------------------------- Steps -------------------------- */

  const lastStep = flowHasKits ? STEP.SEO : STEP.KITS;

  const canAccessStep = useMemo(
    () => [true, !!values.title?.trim(), true, true, true],
    [values]
  );

  const nextStep = useCallback(
    () => setStep((s) => Math.min(s + 1, lastStep)),
    [lastStep]
  );

  /* ----------------------- Submit -------------------------- */

  const onSubmit = useCallback(
    async (data: FormData) => {
      const payload = {
        ...data,
        keywords,
        productOptions,
        variants: rows,
        isThumbnail,
        files,
        selected_sales_channels,
        kits: Object.entries(kits).map(([variantId, items]) => ({
          variantId,
          options: items.map((o) => ({
            id: o.id,
            itemId: o.itemId,
            itemTitle: o.itemTitle,
            quantity: Number(o.quantity) || 0,
          })),
        })),
      };

      console.log("Submitting product", payload);
      await addProduct(payload);
    },
    [
      keywords,
      productOptions,
      rows,
      kits,
      files,
      addProduct,
      selected_sales_channels,
      isThumbnail,
    ]
  );

  /* ----------------------- Render -------------------------- */

  return (
    <DialogPopUp
      title="Create Product"
      description="Fill in the details to create a new product."
      isOpen
      handleClose={() => {}}
    >
      <ScrollArea className="h-[96vh] w-full">
        <div className="bg-white min-h-screen">
          {/* Header */}
          <PageHeander
            tabs={
              flowHasKits
                ? ["Details", "Organize", "Variants", "Inventory kits", "SEO"]
                : ["Details", "Organize", "Variants", "SEO"]
            }
            step={step}
            setStep={setStep}
            canAccessStep={canAccessStep}
            onCancel={() => router.back()}
          />

          {/* DETAILS */}
          {step === STEP.DETAILS && (
            <div className="p-8 pb-32 max-w-[800px] m-auto">
              <Details control={control} errors={errors} />
              <Media
                isThumbnail={isThumbnail}
                setIsThumbnail={setIsThumbnail}
              />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Variants
                </h3>
                <div className="shadow-md bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <SwitchField
                      control={control}
                      errors={errors}
                      name={"hasVariants"}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor="has-variants"
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        Yes, this is a product with variants
                      </Label>
                      <p className="text-sm text-gray-600">
                        When unchecked, we will create a default variant for
                        you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Variants
                productOptions={productOptions}
                setProductOptions={setProductOptions}
                hasVariant={watch("hasVariants")}
              />
            </div>
          )}

          {/* ORGANIZE */}
          {step === STEP.ORGANIZE && (
            <Organize control={control} errors={errors} />
          )}

          {/* VARIANTS */}
          {step === STEP.VARIANTS && (
            <ScrollArea className="rounded-lg border">
              <VariantPriceEditor
                rows={rows}
                setRows={setRows}
                productOptions={productOptions}
              />
            </ScrollArea>
          )}

          {/* INVENTORY KITS */}
          {flowHasKits && step === STEP.KITS && (
            <ScrollArea className="h-[70vh] rounded-lg border">
              <InventorytKits variants={rows} kits={kits} setKits={setKits} />
            </ScrollArea>
          )}

          {/* SEO (always last step) */}
          {step === lastStep && (
            <SEOForm
              control={control}
              errors={errors}
              keywords={keywords}
              setKeywords={setKeywords}
              disabled_path="disabled_path"
              title={values.meta_title}
              description={values.meta_description}
            />
          )}

          {/* Footer */}
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
