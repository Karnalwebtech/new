"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import PostFromCard from "@/components/post/post-form-card";
import Loader from "@/components/loader";
import NotFound from "@/app/dashboard/not-found";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { postSchema } from "@/zod-shema/post-schema";
import { seoSchema } from "@/zod-shema/seo-schema";
import { toast } from "sonner";
import { addFile, removeAll } from "@/reducers/file-slice";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useTagDetailsQuery, useUpdateTagMutation } from "@/state/tag-api";
import { TagFormData } from "@/types/tag-type";
import { ListResult } from "@/types/list-type";
import { slugify } from "@/services/helpers";

interface UpdateTagProps {
  id?: string;
  type?: string;
}

const UpdateTag = ({ id = "", type = "post" }: UpdateTagProps) => {
  // API Hooks
  const { data, error, isLoading } = useTagDetailsQuery({ id });
  const dispatch = useDispatch();
  const [keywords, setKeywords] = useState<string[]>([]);
  const fileData = useSelector((state: RootState) => state?.files?.files);
  const [
    updateTag,
    { isLoading: updateLoading, error: UpdateError, isSuccess },
  ] = useUpdateTagMutation();
  useHandleNotifications({
    error: error || UpdateError,
    isSuccess,
    successMessage: "tag updated successfuly",
    redirectPath: `/dashboard/${type}/tag`,
  });
  // Combine schemas once
  const postWithSeoSchema = useMemo(() => postSchema.merge(seoSchema), []);
  type PostWithSeoFormData = z.infer<typeof postWithSeoSchema>;

  // Form Handling
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PostWithSeoFormData>({
    resolver: zodResolver(postWithSeoSchema),
  });

  const result = data?.result;

  // Memoize watched values to prevent unnecessary re-renders [^1]
  const title = watch("meta_title", "");
  const description = watch("meta_description", "");

  const meta_canonical_url = watch("meta_canonical_url", "");
  useEffect(() => {
    if (meta_canonical_url) {
      const slug = slugify(meta_canonical_url);
      setValue("meta_canonical_url", slug);
    }
  }, [meta_canonical_url, setValue]);
  // Handle Form Submission - dependencies reduced to essential values
  const onSubmit = useCallback(
    async (formData: PostWithSeoFormData) => {
      if (fileData.length === 0) {
        toast.error("Please add all images");
        return;
      }

      const updatedData: TagFormData = {
        ...formData,
        keywords,
        FileData: fileData.map(({ fileType, _id }) => ({ [fileType]: _id })),
        type,
        id: result?._id || "",
      };
      // Uncomment when ready to implement:
      await updateTag(updatedData);
      dispatch(removeAll());
    },
    [fileData, keywords, dispatch, updateTag, type, result]
  );

  // Populate Form Data - only run when result changes
  useEffect(() => {
    dispatch(removeAll());
    if (!result) return;

    setValue("title", result.title);
    setValue("status", result.status);
    setValue("content", result.content);
        setValue("downloadurl", result.downloadurl);
    setValue("description", result.description);
    setValue("meta_title", result?.seo?.meta_title || "");
    setValue("meta_description", result?.seo?.meta_description || "");
    setValue("meta_canonical_url", result?.seo?.meta_canonical_url || "");
    setKeywords(result?.seo?.keywords || []);
  }, [result, setValue, dispatch]);

  // Handle file data - optimized to run only when result changes
  useEffect(() => {
    if (!result) return;

    // Process files in a single pass
    const fileTypes = Object.keys(result) as Array<keyof ListResult>;

    fileTypes.forEach((item) => {
      const file = result[item];

      // Ensure the file is an object with required properties
      if (
        file &&
        typeof file === "object" &&
        "title" in file &&
        "_id" in file
      ) {
        dispatch(
          addFile({
            title: file.title,
            public_id: file.public_id,
            mimetype: file.mimetype,
            _id: file._id,
            fileType: item,
            originalname: file.originalname,
            category: file.category,
          })
        );
      }
    });
  }, [result, dispatch]);

  if (error) {
    return <NotFound />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="dark-custom relative">
      {isLoading ? (
        <div className="min-h-[600px] flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <PostFromCard
          control={control}
          errors={errors}
          setValue={setValue}
          setKeywords={setKeywords}
          keywords={keywords}
          pageTitle="Update Tag"
          isLoading={updateLoading}
          discard_link={`/dashboard/${type}/tag`}
          watchseoTitle={title}
          watchseoDescription={description}
        />
      )}
    </form>
  );
};

export default memo(UpdateTag);
