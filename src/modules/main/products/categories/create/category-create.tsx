"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import DialogPopUp from "@/components/drawer/dialog-component";
import Details from "./details";
import SEOForm from "@/components/forms/SEO-form";
import { ProductCategoryDetailsSchema } from "@/zod-shema/product-schema";
import { seoSchema } from "@/zod-shema/seo-schema";
import { slugify } from "@/services/helpers";
import { RootState } from "@/store";
import { baseurl } from "@/config";
import { useAddProductCategoryMutation } from "@/state/product-category-api";
import { ProductCategoryFormData } from "@/types/product-type";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import PageHeader from "@/modules/layout/header/page-heander";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import { removeAll } from "@/reducers/file-slice";
const schema = ProductCategoryDetailsSchema.merge(seoSchema);
type FormData = z.infer<typeof schema>;

const ProductCategoryForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [keywords, setKeywords] = useState<string[]>([]);
  const fileData = useSelector((state: RootState) => state.files?.files);
  const [AddProductCategory, { isLoading, isSuccess, error }] =
    useAddProductCategoryMutation();

  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Product category added successfully!",
    redirectPath: "/dashboard/products/categories",
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(removeAll());
    }
  }, [isSuccess, dispatch]);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      status: "active",
      visibility: "publish",
      meta_canonical_url: baseurl,
    },
    resolver: zodResolver(schema),
  });

  // Step validation logic
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

  // const handleNext = () => {
  //   if (step < tabs.length - 1 && canAccessStep[step + 1]) {
  //     setStep((prev) => prev + 1);
  //   }
  // };

  const meta_canonical_url = watch("meta_canonical_url", "");
  useEffect(() => {
    if (meta_canonical_url) {
      const slug = slugify(meta_canonical_url);
      setValue("meta_canonical_url", slug);
    }
  }, [meta_canonical_url, setValue]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      const payload: ProductCategoryFormData = {
        ...data,
        keywords,
        FileData: fileData.map(({ fileType, _id }) => ({ [fileType]: _id })),
      };
      console.log("Form Submitted:", payload);
      await AddProductCategory(payload);
      // send API request or dispatch action here
    },
    [AddProductCategory, fileData, keywords]
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
          <PageHeader
            tabs={["Details", "SEO"]}
            step={step}
            setStep={setStep}
            canAccessStep={canAccessStep}
            onCancel={() => router.back()}
          />
          {step === 0 && <Details control={control} errors={errors} />}
          {step === 1 && (
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
          <PageFooter<FormData>
            step={step}
            lastStep={1} // or whatever your last step index is
            canAccessStep={canAccessStep} // example: at least 2 steps
            handleNext={() => setStep(step + 1)}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isLoading={isLoading}
            onCancel={() => router.back()}
          />
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default ProductCategoryForm;
