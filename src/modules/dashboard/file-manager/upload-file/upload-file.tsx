"use client";
import ButtonEvent from "@/components/buttons/btn-event";
import FileUploader from "@/components/uploader/file-uploader";
import React, { memo, useMemo, useState } from "react";
import axiosInstance from "@/services/AxiosInstance";
import { apiUrl,apiKey } from "@/config";
import { toast } from "sonner";
import { useImageDrop } from "@/hooks/handleMediaDrop";
import { Progress } from "@/components/ui/progress";
import { AxiosError } from "axios";

const UploadFile = () => {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { imageitemData, files, setFiles, setImageItemData, handleDrop } =
    useImageDrop(10);

  const uploadHandler = async () => {
    if (files.length === 0) {
      toast.error("Please select files first.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      await axiosInstance.post(`${apiUrl}/file-upload`, formData, {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "multipart/form-data" },
        onUploadProgress: ({ loaded, total }) =>
          setProgress(Math.round((loaded * 100) / (total ?? 1))),
      });
      toast.success("File uploaded successfully.");
      setImageItemData([]);
      setFiles([]);
      setProgress(0);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "API error occurred");
      } else if (error instanceof Error) {
        toast.error(error.message || "An unexpected error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize the delete handler
  const handleDelete = useMemo(() => {
    return (index: number) => {
      setImageItemData((prev) => prev.filter((_, i) => i !== index));
      setFiles((prev) => prev.filter((_, i) => i !== index));
    };
  }, [setImageItemData, setFiles]);

  return (
    <div className="px-4 md:px-6  pb-2">
      <FileUploader
        title=""
        field="application/pdf"
        handleDrop={handleDrop}
        handleDelete={handleDelete}
        imageitemData={imageitemData}
      />

      {imageitemData.length > 0 && (
        <div className="mt-4 relative">
          {progress !== null && (
            <div className="relative">
              <Progress
                value={progress}
                className="h-4" // Set background color and height
              />
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                {progress}%
              </span>
            </div>
          )}
        </div>
      )}

      <div className="text-end">
        <ButtonEvent
          title="Upload"
          isLoading={isLoading}
          event={uploadHandler}
          style="mt-4"
        />
      </div>
    </div>
  );
};

export default memo(UploadFile);
