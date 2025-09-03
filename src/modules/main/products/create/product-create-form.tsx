"use client";

import { useCallback, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import Details from "./details";
import PageHeander from "@/modules/layout/header/page-heander";
import Organize from "./organize";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import { useForm } from "react-hook-form";
import DialogPopUp from "@/components/drawer/dialog-component";
import { ProductSchema } from "@/zod-shema/product-schema";
import { seoSchema } from "@/zod-shema/seo-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SEOForm from "@/components/forms/SEO-form";
import VariantsDetails from "./variants-details";

const schema = ProductSchema.merge(seoSchema);
type FormData = z.infer<typeof schema>;
export function ProductCreateForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [keywords, setKeywords] = useState<string[]>([]);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    // defaultValues: {
    //   status: "active",
    //   visibility: "publish",
    // },
    resolver: zodResolver(schema),
  });

  const values = watch();
  const canAccessStep = useMemo(() => {
    return [
      true,
      !!values.title?.trim(),
      values.meta_title?.trim().length > 0 &&
        values.meta_title?.trim().length <= 60 &&
        values.meta_canonical_url?.trim().length > 0 &&
        values.meta_description?.trim().length > 50 &&
        values.meta_description?.trim().length <= 160,
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
      handleClose={() => {}}
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
          {step === 0 && <Details control={control} errors={errors} />}
          {step === 1 && <VariantsDetails />}
          {/* {step === 1 && <Organize control={control} errors={errors}/>} */}

          {step === 2 && <p>sss</p>}
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
