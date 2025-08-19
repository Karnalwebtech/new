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
import { PostFormData } from "@/types/post-type";
import { useAddNewPostMutation } from "@/state/post-api";
import { removeAllCategory, removeAlltags } from "@/reducers/list-slice";
import { slugify } from "@/services/helpers";

export default function AddNewPost() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const fileData = useSelector((state: RootState) => state?.files?.files);
  const dispatch = useDispatch();
  // -------------  use hookes
  const { categories, tags } = useSelector((state: RootState) => state.lists);

  const [addNewPost, { error, isLoading, isSuccess }] = useAddNewPostMutation();
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Post added successfully!",
    redirectPath: "/dashboard/post",
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
  useEffect(() => {
    if (isSuccess) {
      dispatch(removeAll());
      dispatch(removeAllCategory())
      dispatch(removeAlltags())
    }
  }, [isSuccess, dispatch])
  const onSubmit = useCallback(
    async (formData: PostWithSeoFormData) => {
      console.log("click");
      if (fileData.length === 0) {
        toast.error("Please add all images");
        return;
      }

      const updatedData: PostFormData = {
        ...formData,
        categories,
        tags,
        keywords,
        FileData: fileData.map(({ fileType, _id }) => ({ [fileType]: _id })),
      };
      await addNewPost(updatedData);

    },
    [keywords, fileData, addNewPost, categories, tags]
  );

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
        pageTitle="Add post"
        isLoading={isLoading}
        discard_link="/dashboard/post"
        watchseoTitle={title}
        watchseoDescription={description}
        isVisiableCategory={true}
        isVisiableTag={true}
        listType={"post"}
      />
    </form>
  );
}
