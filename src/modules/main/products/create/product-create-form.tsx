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
import { seoSchema } from "@/zod-schema/seo-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SEOForm from "@/components/forms/SEO-form";
import VariantsDetails from "./variants-details";
import { useDispatch, useSelector } from "react-redux";
import { clearSelected } from "@/reducers/healper-slice";
import { RootState } from "@/store";

type FormData = z.infer<typeof ProductSchema>;
export function ProductCreateForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const { selected,selectedKeyValuePair } = useSelector((state: RootState) => state.helper);
  const [keywords, setKeywords] = useState<string[]>([]);
  useEffect(() => {
   dispatch(clearSelected())
  }, [dispatch]);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      hasVariants: false,   // <-- add this
    },
    resolver: zodResolver(ProductSchema),
  });

  const values = watch();

  const canAccessStep = useMemo(() => {
    const mt = values.meta_title?.trim() || "";
    const md = values.meta_description?.trim() || "";
    const mc = values.meta_canonical_url?.trim() || "";

    const isMetaTitleValid =
      mt.length >= 3 && mt.length <= 60;

    const isMetaDescriptionValid =
      md.length >= 50 && md.length <= 160;

    const isCanonicalValid =
      /^[a-zA-Z0-9-]+$/.test(mc);

    return [
      true,
      !!values.title?.trim(),
      isMetaTitleValid && isMetaDescriptionValid && isCanonicalValid,
    ];
  }, [values]);


  const onSubmit = useCallback(
    async (data: FormData) => {
      // const payload: ProductCategoryFormData = {
      //   ...data,
      //   keywords,
      //   categoryId,
      //   FileData: fileData.map(({ fileType, _id }) => ({ [fileType]: _id })),
      // };
      // if (catId) {
      //   await UpdateProductCategory({ ...payload, id: catId });
      //   return;
      // }
      // await AddProductCategory(payload);
      // send API request or dispatch action here
    },
    [
      // AddProductCategory,
      // categoryId,
      // UpdateProductCategory,
      // fileData,
      // keywords,
      // catId,
    ]
  );

  return (
    <DialogPopUp
      title="Create Product Category"
      description="Fill in the details to create a new product category."
      isOpen={true}
      handleClose={() => { }}
    >
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden">
        <div className="w-full mx-auto bg-white min-h-screen">
          <PageHeander
            tabs={["Details", "Organize", "Variants", "SEO"]}
            step={step}
            setStep={setStep}
            canAccessStep={canAccessStep}
            onCancel={() => router.back()}
          />
          {step === 0 && <Details control={control} errors={errors} hasVariant={watch("hasVariants")} />}
          {step === 1 && <Organize control={control} errors={errors}/>}
          {step === 2 && <VariantsDetails />}

          {/* {step === 3 && <p>sss</p>} */}
          {/* {step === 2 && (
            <Variants />
          )} */}
          {step === 3 && (
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
            lastStep={3} // or whatever your last step index is
            canAccessStep={canAccessStep} // example: at least 2 steps
            handleNext={() => setStep(step + 1)}
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
