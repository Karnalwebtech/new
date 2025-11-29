"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import PostFromCard from "@/components/post/post-form-card";
import Loader from "@/components/loader";
import {
  useCategorieDetailsQuery,
  useUpdateCategorieMutation,
} from "../../../state/categorie-api";
import NotFound from "@/app/dashboard/not-found";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { postSchema } from "@/zod-schema/post-schema";
import { seoSchema } from "@/zod-schema/seo-schema";
import type { CategorieFormData } from "@/types/categorie-type";
import { toast } from "sonner";
import { addFile, removeAll } from "@/reducers/file-slice";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { ListResult } from "@/types/list-type";
import { slugify } from "@/services/helpers";

interface UpdateCategorieProps {
  id?: string;
  type?: string;
}

const UpdateCategorie = ({ id = "", type = "post" }: UpdateCategorieProps) => {
  // API Hooks
  const { data, error, isLoading } = useCategorieDetailsQuery({ id });
  const dispatch = useDispatch();
  const [keywords, setKeywords] = useState<string[]>([]);
  const fileData = useSelector((state: RootState) => state?.files?.files);
  const [
    updateCategorie,
    { isLoading: updateLoading, error: UpdateError, isSuccess },
  ] = useUpdateCategorieMutation();
  useHandleNotifications({
    error: error || UpdateError,
    isSuccess,
    successMessage: "Categorie updated successfuly",
    redirectPath: `/dashboard/${type}/categorie`,
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

      const updatedData: CategorieFormData = {
        ...formData,
        keywords,
        FileData: fileData.map(({ fileType, _id }) => ({ [fileType]: _id })),
        type,
        id: result?._id || "",
      };
      // Uncomment when ready to implement:
      await updateCategorie(updatedData);
      dispatch(removeAll());
    },
    [fileData, keywords, dispatch, updateCategorie, type, result]
  );

  // Populate Form Data - only run when result changes
  useEffect(() => {
    dispatch(removeAll());
    if (!result) return;

    setValue("title", result.title);
    setValue("status", result.status);
    setValue("content", result.content);
    setValue("description", result.description);
        setValue("downloadurl", result.downloadurl);
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
          pageTitle="Update Categorie"
          isLoading={updateLoading}
          discard_link={`/dashboard/${type}/categorie`}
          watchseoTitle={title}
          watchseoDescription={description}
        />
      )}
    </form>
  );
};

export default memo(UpdateCategorie);
