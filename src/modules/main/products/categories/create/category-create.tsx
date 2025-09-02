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
import {
  useAddProductCategoryMutation,
  useGetSingleQuery,
  useUpdateProductCategoryMutation,
} from "@/state/product-category-api";
import { ProductCategoryFormData } from "@/types/product-type";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import PageHeader from "@/modules/layout/header/page-heander";
import { PageFooter } from "@/modules/layout/footer/page-footer";
import { addFile, removeAll } from "@/reducers/file-slice";
import FormSkeleton from "@/components/skeletons/form-skeleton";
const schema = ProductCategoryDetailsSchema.merge(seoSchema);
type FormData = z.infer<typeof schema>;
interface ProductCategoryFormProps {
  catId?: string;
}
const ProductCategoryForm = ({ catId }: ProductCategoryFormProps) => {
  const {
    data,
    isLoading: dataFetchLoading,
    error: dataFetchError,
  } = useGetSingleQuery({ id: catId as string,query:"edit" }, { skip: !catId });

  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [keywords, setKeywords] = useState<string[]>([]);
  const fileData = useSelector((state: RootState) => state.files?.files);
  const [categoryId, setCategoryId] = useState<string[]>([]);
  const [AddProductCategory, { isLoading, isSuccess, error }] =
    useAddProductCategoryMutation();
  const [
    UpdateProductCategory,
    { isLoading: updateLoading, error: updateError, isSuccess: updateSuccess },
  ] = useUpdateProductCategoryMutation();
  useHandleNotifications({
    error: error || updateError || dataFetchError,
    isSuccess: isSuccess || updateSuccess,
    successMessage: isSuccess
      ? "Product category added successfully!"
      : "Product category updated successfully!",
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
    },
    resolver: zodResolver(schema),
  });
  const result = data?.result;
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
        categoryId,
        FileData: fileData.map(({ fileType, _id }) => ({ [fileType]: _id })),
      };
      if (catId) {
        await UpdateProductCategory({ ...payload, id: catId });
        return;
      }

      await AddProductCategory(payload);
      // send API request or dispatch action here
    },
    [
      AddProductCategory,
      categoryId,
      UpdateProductCategory,
      fileData,
      keywords,
      catId,
    ]
  );

  useEffect(() => {
    dispatch(removeAll());
    if (!result) return;

    setValue("title", result.name!);
    setValue("description", result.description);
    setValue("status", result.status);
    setValue("visibility", result.visibility);
    setValue("meta_title", result?.seo_id?.meta_title || "");
    setValue("meta_description", result?.seo_id?.meta_description || "");
    setValue("meta_canonical_url", result?.seo_id?.meta_canonical_url || "");
    setKeywords(result?.seo_id?.keywords || []);
    setCategoryId(
      Array.isArray(result?.parent_category_id)
        ? result?.parent_category_id.map((item) => item?._id)
        : []
    );
  }, [result, setValue, dispatch, catId]);

  useEffect(() => {
    if (!result) return;

    // Process files in a single pass
    const file = result?.thumbnail;
    // Ensure the file is an object with required properties
    if (file && typeof file === "object" && "title" in file && "_id" in file) {
      dispatch(
        addFile({
          title: file.title,
          public_id: file.public_id,
          mimetype: file.mimetype,
          _id: file._id,
          fileType: "thumbnail",
          originalname: file.originalname,
          category: file.category,
        })
      );
    }
  }, [result, dispatch]);

  return (
    <DialogPopUp
      title="Create Product Category"
      description="Fill in the details to create a new product category."
      isOpen={true}
      handleClose={() => {}}
    >
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden">
        {dataFetchLoading ? (
          <FormSkeleton />
        ) : (
          <div className="w-full mx-auto bg-white min-h-screen">
            <PageHeader
              tabs={["Details", "SEO"]}
              step={step}
              setStep={setStep}
              canAccessStep={canAccessStep}
              onCancel={() => router.back()}
            />
            {step === 0 && (
              <Details
                control={control}
                errors={errors}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                catId={catId}
              />
            )}
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
              isLoading={isLoading || updateLoading}
              onCancel={() => router.back()}
            />
          </div>
        )}
      </ScrollArea>
    </DialogPopUp>
  );
};

export default ProductCategoryForm;
