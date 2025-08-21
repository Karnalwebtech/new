"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DrawerComponent } from "@/components/drawer/drawer-component";
import { useRouter } from "next/navigation";
import Details from "./details";
export function ProductCreateForm() {
  const router = useRouter();

  const tabs = ["Details", "Organize", "Variants"];

  return (
    <DrawerComponent
      title="Create Product"
      description="Fill in the details to create a new product."
      isOpen={true}
      handleClose={() => {}}
    >
      <ScrollArea className="h-[97vh] w-full p-0">
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
                  {tabs.map((tab) => (
                    <Button
                      key={tab}
                      //   onClick={() => setActiveTab(tab)}
                      className={`flex text-sm font-medium bg-white  text-gray-800 w-[180px] py-6 rounded-[0px] border-0
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

          <Details />

          {/* Footer Actions */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button variant="outline">Save as draft</Button>
              <Button className="bg-gray-900 hover:bg-gray-800">
                Continue
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DrawerComponent>
  );
}
