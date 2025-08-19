"use client";
import { memo, useState } from "react";
import { ScrollArea } from "../../ui/scroll-area";
import FetchFiles from "./fetch-files";
import { Button } from "@/components/ui/button";
import { CloudUpload, ImageIcon } from "lucide-react";
import UploadFile from "@/modules/dashboard/file-manager/upload-file/upload-file";

const FileLoader = () => {
  const [isUploaderTab, setIsUploaderTab] = useState<boolean>(false);
  return (
    <>
      <div className="w-full max-h-[600px] max-w-[1380px] m-auto overflow-hidden">
        <ScrollArea className="h-96 rounded-md border">
          <div className="flex gap-4">
            <div className="w-[30%] space-y-3 mt-4">
              <Button
                variant={"default"}
                className="w-full"
                onClick={() => setIsUploaderTab(false)}
              >
                <ImageIcon /> Media
              </Button>
              <Button
                variant={"default"}
                className="w-full"
                onClick={() => setIsUploaderTab(true)}
              >
                <CloudUpload /> Upload
              </Button>
            </div>
            <div>
              {isUploaderTab ? (
                <div className="mt-4">
                  <UploadFile />
                </div>
              ) : (
                <FetchFiles />
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default memo(FileLoader);
