"use client";

import { useCallback, useState } from "react";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import InputField from "../fields/input-field";
import TextareaField from "../fields/textarea-field";

interface SeoFormProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  keywords: string[];
  setKeywords: (value: string[] | ((prev: string[]) => string[])) => void;
  disabled_path?: string;
  title?: string;
  description?: string;
}

const Seo_form = <T extends FieldValues>({
  disabled_path= "",
  control,
  errors,
  keywords,
  setKeywords,
  title = "",
  description = "",
}: SeoFormProps<T>) => {
  const [keywordInput, setKeywordInput] = useState("");

  const addKeywords = useCallback(
    (newKeywords: string[]) => {
      setKeywords((prev: string[]) => {
        const uniqueNewKeywords = newKeywords.filter(
          (keyword) => keyword.trim() !== "" && !prev?.includes(keyword.trim())
        );
        return [...prev, ...uniqueNewKeywords];
      });
    },
    [setKeywords]
  );
  const handleKeywordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(e.target.value);
  };

  const handleKeywordInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newKeywords = keywordInput.split(",").map((k) => k.trim());
      addKeywords(newKeywords);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords((prev: string[]) => prev.filter((k: string) => k !== keyword));
  };

  // Character Count Color Logic
  const getCharacterCountColor = (current: number, max: number) => {
    if (current === 0) return "text-gray-500";
    return current <= max ? "text-green-500" : "text-red-500";
  };

  return (
    <Card className="w-full bg-transparent">
      <CardHeader>
        <CardTitle className="text-gray-200">SEO Fields</CardTitle>
        <CardDescription className="text-gray-200">
          Enter your page&apos;s SEO information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Meta Title */}
        <div className="space-y-2">
          <InputField
            control={control}
            errors={errors}
            name={"meta_title" as Path<T>}
            label="Enter page title"
            type="text"
            inputStyle="text-gray-300 placeholder-gray-200 bg-transparent border-zinc-300"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-200">Recommended: 50-60 characters</span>
            <span className={getCharacterCountColor(title.length, 60)}>
              {title.length}/60
            </span>
          </div>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <TextareaField
            control={control}
            errors={errors}
            name={"meta_description" as Path<T>}
            label="Enter meta description"
            inputStyle="text-gray-300 placeholder-gray-200 bg-transparent border-zinc-300"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-200">
              Recommended: 150-160 characters
            </span>
            <span className={getCharacterCountColor(description.length, 160)}>
              {description.length}/160
            </span>
          </div>
        </div>

        {/* Keywords */}
        <div>
          <Label htmlFor="keywords" className="text-gray-200">
            Keywords
          </Label>

          <Input
            placeholder="Enter keywords (comma-separated or press Enter)"
            value={keywordInput}
            className="text-gray-300 placeholder-gray-200 bg-transparent border-zinc-300"
            onChange={handleKeywordInputChange}
            onKeyDown={handleKeywordInputKeyDown}
          />

          <div className="flex flex-wrap gap-2 mt-2">
            {keywords?.map((keyword: string, index: number) => (
              <span
                key={index}
                className="bg-gray-300 text-black px-2 py-1 rounded-full text-sm flex items-center"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="ml-2 focus:outline-none"
                  aria-label={`Remove ${keyword}`}
                >
                  <X size={14} color="red"/>
                </button>
              </span>
            ))}
          </div>
        </div>
        {/* Canonical URL */}
        <div>
          <Label htmlFor="canonicalUrl" className="text-gray-300">
            Canonical URL
          </Label>
          <p className="text-gray-300 text-sm">
            Remove symbols like /, @, #, !, $, %, ^, &, *, (, ), +, =, [, ], |,
            :, ;, &apos;, &quot;, &lt;, &gt;, ,, ?, and ~.
          </p>
          <div className="relative">
            <InputField
              control={control}
              errors={errors}
              disabled_path={disabled_path==="canonical-url"?true:false} 
              name={"meta_canonical_url" as Path<T>}
              label="Enter meta Canonical Url"
              type="text"
              inputStyle="text-gray-300 placeholder-gray-200 bg-transparent border-zinc-300"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Seo_form;
