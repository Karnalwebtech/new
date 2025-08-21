"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload } from "lucide-react";
import Media from "./media";
import Variants from "./variants";
const Details = () => {
  const [hasVariants, setHasVariants] = useState(false);
  const [formData, setFormData] = useState({
    title: "Winter jacket",
    subtitle: "Warm and cosy",
    handle: "winter-jacket",
    description: "A warm and cozy jacket",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <>
      {/* Form Content */}
      <div className="p-8 pb-32 max-w-[800px] m-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-8">General</h2>

        <div className="space-y-8">
          {/* Title, Subtitle, Handle Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="subtitle"
                className="text-sm font-medium text-gray-500"
              >
                Subtitle <span className="text-gray-400">Optional</span>
              </Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="handle"
                className="text-sm font-medium text-gray-500 flex items-center gap-2"
              >
                Handle
                <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">i</span>
                </div>
                <span className="text-gray-400">Optional</span>
              </Label>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-1">/</span>
                <Input
                  id="handle"
                  value={formData.handle}
                  onChange={(e) => handleInputChange("handle", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-500"
            >
              Description <span className="text-gray-400">Optional</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full min-h-[100px] resize-none"
            />
          </div>
          <Media />
          <Variants />
        </div>
      </div>
    </>
  );
};

export default Details;
