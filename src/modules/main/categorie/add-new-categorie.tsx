"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PostFromCard from "@/components/post/post-form-card";
import { seoSchema } from "@/zod-schema/seo-schema";
import { postSchema } from "@/zod-schema/post-schema";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import { baseurl } from "@/config";
import { useAddNewCategorieMutation } from "@/state/categorie-api";
import { CategorieFormData } from "@/types/categorie-type";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { removeAll } from "@/reducers/file-slice";
import { slugify } from "@/services/helpers";
interface AddNewPostCategorieProps {
  type?: string;
}
export default function AddNewPostCategorie({
  type = "post",
}: AddNewPostCategorieProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const fileData = useSelector((state: RootState) => state?.files?.files);
  const dispatch = useDispatch();
  // -------------  use hookes
  const [addNewCategorie, { error, isLoading, isSuccess }] =
    useAddNewCategorieMutation();
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Category added successfully!",
    redirectPath: `/dashboard/${type}/categorie`,
  });

  const postWithSeoSchema = postSchema.merge(seoSchema);
  type PostWithSeoFormData = z.infer<typeof postWithSeoSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PostWithSeoFormData>({
    defaultValues: { status: "draft", meta_canonical_url: baseurl },
    resolver: zodResolver(postWithSeoSchema),
  });
  // Submit Handler
  const onSubmit = useCallback(
    async (formData: PostWithSeoFormData) => {
      console.log("click");
      if (fileData.length === 0) {
        toast.error("Please add all images");
        return;
      }

      const updatedData: CategorieFormData = {
        ...formData,
        keywords,
        FileData: fileData.map(({ fileType, _id }) => ({ [fileType]: _id })),
        type,
      };
      await addNewCategorie(updatedData);
      dispatch(removeAll());
    },
    [keywords, fileData, addNewCategorie, dispatch, type]
  );
  useEffect(() => {
    dispatch(removeAll());
  }, [dispatch]);
  const title = watch("meta_title", "");
  const description = watch("meta_description", "");
  const meta_canonical_url = watch("meta_canonical_url", "");
  useEffect(() => {
    if (meta_canonical_url) {
      const slug = slugify(meta_canonical_url);
      setValue("meta_canonical_url", slug);
    }
  }, [meta_canonical_url, setValue]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="dark-custom">
      <PostFromCard
        control={control}
        errors={errors}
        setValue={setValue}
        setKeywords={setKeywords}
        keywords={keywords}
        pageTitle="Add new categorie"
        isLoading={isLoading}
        discard_link={`/dashboard/${type}/categorie`}
        watchseoTitle={title}
        watchseoDescription={description}
      />
    </form>
  );
}
