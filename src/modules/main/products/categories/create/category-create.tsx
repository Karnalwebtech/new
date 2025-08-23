"use client";

import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DrawerComponent } from "@/components/drawer/drawer-component";
import { useRouter } from "next/navigation";
import Details from "./details";
import DialogPopUp from "@/components/drawer/dialog-component";
import { useState } from "react";
import CategoryOrganizer from "./category-ranking";

const ProductCategoryForm = () => {
  const router = useRouter();
  const [step, setSteps] = useState<number>(0);
  // console.log(params?.["organize-ranking"]);
  const tabs = ["Details", "Organize Ranking"];
  const handleParams = () => {
    // router.push("/dashboard/products/categories/create?organize-ranking");
  };
  return (
    <DialogPopUp
      title="Create Product Category"
      description="Fill in the details to create a new product category."
      isOpen={true}
      handleClose={() => {}}
    >
      <ScrollArea className="h-[96vh] w-full p-0 rounded-lg overflow-hidden">
        <div className="w-full mx-auto bg-white min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white sticky top-0">
            <div>
              <div className="flex items-center">
                <div className="pr-6 p-2 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/dashboard/products")}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-gray-500"
                  >
                    esc
                  </Button>
                </div>
                <div className="flex">
                  {tabs.map((tab, index) => (
                    <Button
                      key={tab}
                      onClick={() => setSteps(index)}
                      className={`flex text-sm font-medium bg-white text-gray-800 hover:text-gray-100 w-[180px] py-6 rounded-[0px] border-0
                        ${
                          step === index
                            ? "border-b-2 bg-gray-100 border-black"
                            : ""
                        }
                      `}
                    >
                      {/* {tab === "Details" && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                      {tab === "Organize" && (
                        <div className="w-4 h-4 border border-gray-300 rounded" />
                      )}
                      {tab === "Variants" && (
                        <div className="w-4 h-4 border border-gray-300 rounded" />
                      )} */}
                      {tab}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div></div>
          </div>
          <form>
            {step === 0 && <Details />}
            {step === 1 && <CategoryOrganizer />}
            {/* Footer Actions */}
            <div className="fixed z-50 bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button variant="outline">Save as draft</Button>
                {step === 0 ? (
                  <Button
                    className="bg-gray-900 hover:bg-gray-800"
                    onClick={() => setSteps(1)}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button className="bg-gray-900 hover:bg-gray-800">
                    Save
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </ScrollArea>
    </DialogPopUp>
  );
};
export default ProductCategoryForm;
