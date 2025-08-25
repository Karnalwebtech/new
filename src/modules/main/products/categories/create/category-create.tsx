"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { CircleDashed, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import DialogPopUp from "@/components/drawer/dialog-component";
import Details from "./details";
import CategoryDragSystem from "./category-drag-system";
import SEOForm from "@/components/forms/SEO-form";

import { ProductCategoryDetailsSchema } from "@/zod-shema/product-schema";
import { seoSchema } from "@/zod-shema/seo-schema";
import { slugify } from "@/services/helpers";
import { RootState } from "@/store";
import { baseurl } from "@/config";
import { useAddProductCategoryMutation } from "@/state/product-category-api";
import { ProductCategoryFormData } from "@/types/product-type";
import { GeneralBtn } from "@/components/buttons/general-btn";
import { useHandleNotifications } from "@/hooks/use-notification-handler";

const tabs = ["Details", "SEO", "Organize Ranking"];

const schema = ProductCategoryDetailsSchema.merge(seoSchema);
type FormData = z.infer<typeof schema>;

const ProductCategoryForm = () => {
  const router = useRouter();
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
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
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

  const handleNext = () => {
    if (step < tabs.length - 1 && canAccessStep[step + 1]) {
      setStep((prev) => prev + 1);
    }
  };

  // const handleSlugifyCanonicalUrl =useCallback(() => {
  //   const rawUrl = getValues("meta_canonical_url");
  //   const slug = slugify(rawUrl.trim());
  //   setValue("meta_canonical_url", slug);
  // },[getValues,setValue]);
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
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center">
              <div className="pr-6 p-2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard/products")}
                >
                  <X className="w-5 h-5" />
                </Button>
                <Button variant="secondary" size="sm" className="text-gray-500">
                  esc
                </Button>
              </div>
              <div className="flex">
                {tabs.map((tab, index) => (
                  <Button
                    key={tab}
                    disabled={!canAccessStep[index]}
                    onClick={() => setStep(index)}
                    className={`flex text-sm font-medium bg-white hover:text-gray-100 text-gray-800 w-[180px] py-6 rounded-none border-0
                      ${
                        step === index
                          ? "border-b-2 bg-gray-100 border-black"
                          : ""
                      }
                    `}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          {/* <form onSubmit={handleSubmit(onSubmit)}> */}
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
          {step === 2 && <CategoryDragSystem />}

          {/* Footer */}
          <div className="fixed z-50 bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button variant="outline">Save as draft</Button>
              {step < 2 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canAccessStep[step + 1]}
                  className="bg-gray-900 hover:bg-gray-800"
                >
                  Continue
                </Button>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="inline">
                  <GeneralBtn title="Save" loader={isLoading} type="submit" />
                </form>
              )}
            </div>
          </div>
          {/* </form> */}
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default ProductCategoryForm;
