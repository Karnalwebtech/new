"use client";
import { Calendar, Info, User, Tag, Check, X, File, Copy } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { memo, useCallback } from "react";
import idToUrl, {
  copyToClipboard,
  formatDate,
  formatsampleFileSize,
  getsampleFileExtension,
  idToImageTag,
} from "@/services/helpers";
import Loader from "@/components/loader";
import { FileData } from "@/types/file-types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface FileDetailsProps {
  result: FileData;
  isLoading: boolean;
}
function FileDetails({ isLoading, result }: FileDetailsProps) {
  const handelCopy = useCallback(async (id: string) => {
    toast.success("File URL copy");
    copyToClipboard(id);
  }, []);
  return isLoading ? (
    <div className="h-[400px] w-full">
      <Loader />
    </div>
  ) : (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden border-none shadow-lg p-0">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 p-2 lg:pb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <div>
            <Badge variant="outline">#{result?.no}</Badge>
            <CardTitle className="text-xl md:text-2xl line-clamp-1">
              {result?.title || result?.originalname || "Untitled"}
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={result?.is_active ? "default" : "destructive"}
              className="h-6"
            >
              {result?.is_active ? (
                <>
                  <Check className="w-3 h-3 mr-1" /> Active
                </>
              ) : (
                <>
                  <X className="w-3 h-3 mr-1" /> Inactive
                </>
              )}
            </Badge>
            <Badge variant="outline" className="bg-primary/10 h-6">
              {getsampleFileExtension(result?.mimetype || "")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[400px] md:h-[500px]">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-end gap-4 items-center">
                <div className="truncate max-w-[300px] text-sm text-gray-600">
                  <p className="bold">
                    Copy <span>{result?.category || "Uncategorized"}</span> Url
                  </p>
                  {idToUrl(result)}
                </div>
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => handelCopy(idToUrl(result))}
                >
                  <Copy size={15} />
                </Button>
              </div>
              {result?.category !== "image" ? (
                <div className="flex justify-end gap-4 items-center">
                  <div className="truncate max-w-[300px] text-sm text-gray-600">
                    <p className="bold">
                      Copy <span>{result?.category || "Uncategorized"}</span>{" "}
                      Url
                    </p>
                    {result?.public_id}={result?.originalname}
                  </div>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => handelCopy(`${result?.public_id}=${result?.originalname}`)}
                  >
                    <Copy size={15} />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end gap-4 items-center">
                  <div className="truncate max-w-[300px] text-sm text-gray-600">
                    <p>Copy image tag</p>
                    {idToImageTag(result)}...
                  </div>

                  <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => handelCopy(idToImageTag(result))}
                  >
                    <Copy size={15} />
                  </Button>
                </div>
              )}
              <h3 className="text-sm font-medium flex items-center gap-2">
                <File className="h-4 w-4" />{" "}
                {getsampleFileExtension(result?.mimetype || "")} Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Original Name:
                    </span>
                    <span className="font-medium truncate max-w-[200px]">
                      {result?.originalname}
                    </span>
                  </div>
                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      sampleFile Type:
                    </span>
                    <span className="font-medium">{result?.mimetype}</span>
                  </div>
                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">
                      {formatsampleFileSize(Number(result?.size))}
                    </span>
                  </div>
                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span className="font-medium">
                      {result?.width} × {result?.height}
                    </span>
                  </div>
                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Encoding:</span>
                    <span className="font-medium">{result?.encoding}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Public ID:</span>
                    <span className="font-medium truncate max-w-[200px]">
                      {result?.public_id}
                    </span>
                  </div>
                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Signature:</span>
                    <span className="font-medium truncate max-w-[200px]">
                      {result?.signature || "null"}
                    </span>
                  </div>
                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alt Text:</span>
                    <span className="font-medium truncate max-w-[200px]">
                      {result?.altText || "—"}
                    </span>
                  </div>
                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline">
                      {result?.category || "Uncategorized"}
                    </Badge>
                  </div>
                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant={result?.is_active ? "default" : "destructive"}
                    >
                      {result?.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4" /> Metadata
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {formatDate(result?.createdAt || "")}
                  </span>
                </div>
                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="font-medium">
                    {formatDate(result?.updatedAt || "")}
                  </span>
                </div>
                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Uploaded by:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {result?.user?.name || result?.user?.email || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="bg-muted/10 flex flex-wrap gap-2 p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(result?.createdAt || "")}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Tag className="h-3 w-3" />
          <span>{result?.category || "Uncategorized"}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{result?.user?.name || "Unknown"}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default memo(FileDetails);
