import { Trash2, FileArchive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/services/helpers";

interface FilePreviewCardProps {
  item: {
    file: string;
    name: string;
    size: number;
    type: string;
  };
  index: number;
  onDelete: (index: number) => void;
}

export default function FilePreviewCard({
  item,
  index,
  onDelete,
}: FilePreviewCardProps) {
  const viewFileHandler = () => {
    window.open(item.file || item.name, "_blank");
  };

  const renderPreview = () => {
    if (item.type.startsWith("image/")) {
      return (
        <Image
          src={item.file || "/placeholder.svg"}
          alt={item.name}
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      );
    } else if (item.type === "application/pdf") {
      return (
        <embed
          src={item.file}
          width="100%"
          height="100%"
          type="application/pdf"
        />
      );
    } else if (item.type.startsWith("video/")) {
      return (
        <video
          src={item.file}
          controls
          className="w-full h-full object-cover rounded-lg"
        />
      );
    } else if (
      item.type === "application/zip" ||
      item.type === "application/x-zip-compressed"
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
    if (item.type.startsWith("image/")) return "View Image";
    if (item.type === "application/pdf") return "View PDF";
    if (item.type.startsWith("video/")) return "View Video";
    if (
      item.type === "application/zip" ||
      item.type === "application/x-zip-compressed"
    )
      return "Download ZIP";
    return "View File";
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 overflow-hidden">
        <div className="h-[200px] bg-white flex items-center justify-center overflow-hidden">
          {renderPreview()}
        </div>
        <div className="p-4">
          <p className="line-clamp-1 mb-1">{item.name}</p>
          <p className="text-sm text-gray-500 mb-2">
            {formatFileSize(item.size)}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="bg-primary text-primary-foreground"
              onClick={viewFileHandler}
            >
              {getViewButtonText()}
            </Button>
            <Button variant="destructive" onClick={() => onDelete(index)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
