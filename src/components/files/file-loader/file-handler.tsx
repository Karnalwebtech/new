import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  open,
  setCategory,
  setMaxLimit,
  setTypeid,
} from "@/reducers/healper-slice";
import { RootState } from "@/store";
import FileLoaderCards from "./files-loader-cards";
interface FileHandlerProps {
  title?: string;
  typeId: string;
  maxLimit: number;
  category: string;
}
export const FileHandler = ({
  title,
  typeId,
  maxLimit,
  category,
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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onClick={handelEvent}
          className="flex justify-center items-center cursor-pointer border border-dashed border-gray-400 w-full rounded-sm border-2"
        >
          {filteredFiles.length > 0 ? (
            filteredFiles.map((item) => (
              <div key={item._id}>
                <FileLoaderCards item={item} />
              </div>
            ))
          ) : (
            <div className="flex justify-center h-[200px] items-center">
              <p className="text-gray-400 ">Add {title}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
