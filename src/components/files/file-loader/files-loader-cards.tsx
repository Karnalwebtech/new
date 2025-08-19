"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { addFile, removeFile } from "@/reducers/file-slice";
import { close } from "@/reducers/healper-slice";
import { RootState, useAppSelector } from "@/store";
import { FileArchive, SquareX } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";
interface FileData {
  originalname: string;
  public_id: string;
  mimetype: string;
  title: string;
  category: string;
  _id: string;
}
interface FileItem {
  item: FileData;
}

export default function FileLoaderCards({ item }: FileItem) {
  const dispatch = useDispatch();
  const files = useAppSelector((state: RootState) => state.files.files); // Adjust selector based on your slice
  const fileType = useAppSelector((state: RootState) => state.helper.typeid); // Adjust selector based on your slice
  const maxLimit = useAppSelector((state: RootState) => state.helper.limit); // Adjust selector based on your slice

  const renderPreview = () => {
    if (item.mimetype.startsWith("image/")) {
      return (
        <Image
          src={`https://drive.google.com/uc?id=${item.public_id}`}
          alt={item.title || "Mota"}
          width={500}
          height={500}
          className="object-cover w-full h-full"
          priority
        />
      );
    } else if (item.mimetype === "application/pdf") {
      return (
        <embed
          src={`https://drive.google.com/file/d/${item.public_id}/preview`}
          width="100%"
          height="100%"
          type="application/pdf"
        />
      );
    } else if (item.mimetype.startsWith("video/")) {
      return (
        <iframe
          src={`https://drive.google.com/file/d/${item.public_id}/preview`} // ✅ Fix: Use /preview
          allow="autoplay"
          className="w-full h-full rounded-lg"
        />
      );
    } else if (
      item.mimetype === "application/zip" ||
      item.mimetype === "application/x-zip-compressed"
    ) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-100">
          <FileArchive className="w-24 h-24 text-gray-400" />
        </div>
      );
    }
    return null;
  };
  const filteredFiles = files.filter((file) => file.fileType === fileType);
  const isDuplicate = files.some((file) => file._id === item._id);
  const getFileData = (item: FileData) => {
    // Check if file already exists in Redux store
    if (filteredFiles.length >= maxLimit) {
      dispatch(close());
      return;
    }
    if (!isDuplicate) {
      dispatch(
        addFile({
          fileType: fileType,
          title: item.title,
          _id: item._id,
          mimetype: item.mimetype,
          public_id: item.public_id,
          originalname: item.originalname, // Ensure all required properties exist
          category: item.category,
        })
      );
    }
  };
  return (
    <Card className="overflow-hidden relative">
      <CardContent className="p-0 max-w-[270px] overflow-hidden">
        <div className="h-[200px] bg-white relative flex items-center justify-center overflow-hidden">
          {renderPreview()}
        </div>
        <div className="p-4">
          <p className="line-clamp-1 mb-1">{item.title || "Mota"}</p>
        </div>
        {isDuplicate && (
          <Button
            onClick={() => dispatch(removeFile(item._id))}
            variant="ghost"
            className="absolute top-2 right-2 z-[3] p-2 group"
          >
            <SquareX
              size={24}
              color="white"
              className="stroke-white group-hover:stroke-black transition-colors duration-200"
            />
          </Button>
        )}
        <div
          onClick={() => getFileData(item)}
          className={`absolute inset-0 z-[2] ${
            isDuplicate ? "bg-black/40" : null
          }`}
        ></div>
      </CardContent>
    </Card>
  );
}
