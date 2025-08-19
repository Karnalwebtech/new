"use client";
import { Card, CardContent } from "@/components/ui/card";
import { EllipsisVertical, FileArchive, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { formatFileSize } from "@/services/helpers";
import DownloadFile from "../downloadImage";
import { FileData } from "@/types/file-types";

// interface FileData {
//   no: number,
//   originalname: string,
//   public_id: string,
//   encoding: string,
//   mimetype: string,
//   title: string,
//   category: string,
//   size: number,
//   _id: string,
//   createdAt: Date,
//   updatedAt: Date,
//   __v: number,
// }
interface FileItem {
  item: FileData;
  isOpenImageOptions:()=>void;
}


export default function Server_File_Card({
  item,isOpenImageOptions
}: FileItem) {


  const renderPreview = () => {
    if (item.mimetype.startsWith("image/")) {
      return (
        <Image
          src={`https://lh3.googleusercontent.com/d/${item.public_id}=s400`}
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
    }
    else if (item.mimetype.startsWith("video/")) {
      return (
        <iframe
          src={`https://drive.google.com/file/d/${item.public_id}/preview`} // ✅ Fix: Use /preview
          allow="autoplay"
          className="w-full h-full rounded-lg"
        />
      );
    }
    else if (
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

  const getViewButtonText = () => {
    if (item.mimetype.startsWith("image/")) return <DownloadFile publicId={item.public_id} filename="Image" />;
    if (item.mimetype === "application/pdf") return <DownloadFile publicId={item.public_id} filename="PDF" />;
    if (item.mimetype.startsWith("video/")) return <DownloadFile publicId={item.public_id} filename="Video" />;
    if (
      item.mimetype === "application/zip" ||
      item.mimetype === "application/x-zip-compressed"
    )
      return <DownloadFile publicId={item.public_id} filename="Zip" />;
    return "View File";
  };
  return (

    <Card className="overflow-hidden relative">
      <CardContent className="p-0 overflow-hidden">
        <div className="absolute right-2 rounded-lg top-2 bg-gray-200">
          <Button className='cursor-pointer w-[30px]handleOpen h-[30px] w-[30px]' onClick={isOpenImageOptions}>
            <EllipsisVertical size={"20px"} />
          </Button>
        </div>
        <div className="h-[200px] bg-white flex items-center justify-center overflow-hidden">
          {renderPreview()}
        </div>
        <div className="p-4">
          <p className="line-clamp-1 mb-1">{item.title || "Mota"}</p>
          <p className="text-sm text-gray-500 mb-2">
            {formatFileSize(Number(item?.size))}
          </p>
          <div className="grid grid-cols-2 gap-4 z-auto">
            {getViewButtonText()}

            <Button variant="destructive" disabled={true}
            //</div> onClick={() => onDelete(index)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

  );
}
