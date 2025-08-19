"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PostFromCard from "@/components/post/post-form-card";
import { seoSchema } from "@/zod-shema/seo-schema";
import { postSchema } from "@/zod-shema/post-schema";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import { baseurl } from "@/config";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { removeAll } from "@/reducers/file-slice";
import { useAddNewTagMutation } from "@/state/tag-api";
import { TagFormData } from "@/types/tag-type";
import { slugify } from "@/services/helpers";
interface AddNewTagProps {
  type?: string;
}
export default function AddNewTag({ type = "post" }: AddNewTagProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const fileData = useSelector((state: RootState) => state?.files?.files);
  const dispatch = useDispatch();
  // -------------  use hookes
  const [addNewTag, { error, isLoading, isSuccess }] = useAddNewTagMutation();
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Tag added successfully!",
    redirectPath: `/dashboard/${type}/tag`,
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
    defaultValues: { status: "draft", metaCanonicalUrl: baseurl },
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

      const updatedData: TagFormData = {
        ...formData,
        keywords,
        FileData: fileData.map(({ fileType, _id }) => ({ [fileType]: _id })),
        type,
      };
      await addNewTag(updatedData);
      dispatch(removeAll());
    },
    [keywords, fileData, addNewTag, type, dispatch]
  );
  useEffect(() => {
    dispatch(removeAll());
  }, [dispatch]);
  const title = watch("metaTitle", "");
  const description = watch("metaDescription", "");
  const metaCanonicalUrl = watch("metaCanonicalUrl", "");
  useEffect(() => {
    if (metaCanonicalUrl) {
      const slug = slugify(metaCanonicalUrl);
      setValue("metaCanonicalUrl", slug);
    }
  }, [metaCanonicalUrl, setValue]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="dark-custom">
      <PostFromCard
        control={control}
        errors={errors}
        setValue={setValue}
        setKeywords={setKeywords}
        keywords={keywords}
        pageTitle="Add new tag"
        isLoading={isLoading}
        discard_link={`/dashboard/${type}/tag`}
        watchseoTitle={title}
        watchseoDescription={description}
      />
    </form>
  );
}
