"use client";
import { DrawerComponent } from "@/components/drawer/drawer-component";
import { FileHandler } from "@/components/files/file-loader/file-handler";
import FileLoader from "@/components/files/file-loader/file-loader";
import { Card } from "@/components/ui/card";
import { RootState } from "@/store";
import { Label } from "@radix-ui/react-label";
import { Upload } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { close } from "@/reducers/healper-slice";

const Media = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state?.helper?.isOpen);
  const handleClose = () => {
    dispatch(close());
  };

  return (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-500">
          Media <span className="text-gray-400">Optional</span>
        </Label>
        <FileHandler
          title={"Fetaure image"}
          typeId={"feature_image"}
          maxLimit={1}
          category={"image"}
        />
      </div>

      <DrawerComponent
        title=""
        description=""
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <FileLoader />
      </DrawerComponent>
    </>
  );
};

export default Media;
