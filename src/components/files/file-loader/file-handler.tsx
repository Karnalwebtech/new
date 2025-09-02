import React from "react";
import { Card, CardContent } from "../../ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  open,
  setCategory,
  setMaxLimit,
  setTypeid,
} from "@/reducers/healper-slice";
import { RootState } from "@/store";
import FileLoaderCards from "./files-loader-cards";
import { Upload } from "lucide-react";
interface FileHandlerProps {
  title?: string;
  typeId: string;
  maxLimit: number;
  category: string;
  isgallery?: boolean;
}
export const FileHandler = ({
  title,
  typeId,
  maxLimit,
  category,
  isgallery = true,
}: FileHandlerProps) => {
  const dispatch = useDispatch();
  const filesData = useSelector((state: RootState) => state.files.files);
  const handelEvent = () => {
    dispatch(open());
    dispatch(setTypeid(typeId));
    dispatch(setMaxLimit(maxLimit));
    dispatch(setCategory(category));
  };
  const filteredFiles = filesData.filter((item) => item.fileType === typeId);
  return (
    <Card className="border-2 border-dashed border-gray-200 p-8 cursor-pointer">
      {/* <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader> */}
      <CardContent>
        <div
          onClick={handelEvent}
          // className="flex justify-center items-center cursor-pointer border-dashed border-gray-400 w-full rounded-sm border-2"
        >
          {isgallery && filteredFiles.length > 0 ? (
            filteredFiles.map((item) => (
              <div key={item._id}>
                <FileLoaderCards item={item} />
              </div>
            ))
          ) : (
            <div className="flex justify-center h-[120px] items-center">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Upload images
                  </p>
                  <p className="text-sm text-gray-500">
                    Drag and drop images here or click to upload.
                    <br />
                    Add {title}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
