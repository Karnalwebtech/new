"use client";
import DialogPopUp from "@/components/drawer/dialog-component";
import { useGetProductCategoryQuery } from "@/state/product-category-api";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import React from "react";
import CategoryDragSystem from "./category-drag-system";

const Organize = () => {
  const { data } = useGetProductCategoryQuery({
    rowsPerPage: 200,
    page: 1,
  });
  const result = data?.result || [];
  return (
    <DialogPopUp
      title="Create Product Category"
      description="Fill in the details to create a new product category."
      isOpen={true}
      handleClose={() => {}}
    >
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden">
        <div className="w-full mx-auto bg-white min-h-screen">
          <CategoryDragSystem result={result}/>
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};

export default Organize;
