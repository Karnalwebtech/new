"use client";

import { useCallback, useState } from "react";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
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

const SEOForm = <T extends FieldValues>({
  disabled_path = "",
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
    <div className="w-full bg-transparent p-8 pb-32 max-w-[800px] m-auto">
      <div>
        <div className="text-gray-700">SEO Fields</div>
        <div className="text-gray-500">
          Enter your page&apos;s SEO information
        </div>
      </div>
      <div className="space-y-4">
        {/* Meta Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Meta Title
          </Label>
          <InputField
            control={control}
            errors={errors}
            name={"metaTitle" as Path<T>}
            type="text"
            inputStyle="placeholder-gray-200 bg-transparent border-zinc-300"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Recommended: 50-60 characters</span>
            <span className={getCharacterCountColor(title.length, 60)}>
              {title.length}/60
            </span>
          </div>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <Label
            htmlFor="metaDescription"
            className="text-sm font-medium text-gray-700"
          >
            Meta Description
          </Label>
          <TextareaField
            control={control}
            errors={errors}
            name={"metaDescription" as Path<T>}
            inputStyle="placeholder-gray-200 bg-transparent border-zinc-300"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              Recommended: 150-160 characters
            </span>
            <span className={getCharacterCountColor(description.length, 160)}>
              {description.length}/160
            </span>
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label
            htmlFor="keywords"
            className="text-sm font-medium text-gray-700"
          >
            Meta Keywords
          </Label>

          <Input
            placeholder="Enter keywords (comma-separated or press Enter)"
            value={keywordInput}
            className="placeholder-gray-200 bg-transparent border-zinc-300"
            onChange={handleKeywordInputChange}
            onKeyDown={handleKeywordInputKeyDown}
          />

          <div className="flex flex-wrap gap-2 mt-2">
            {keywords?.map((keyword: string, index: number) => (
              <span
                key={index}
                className="bg-black text-gray-200 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="ml-2 focus:outline-none"
                  aria-label={`Remove ${keyword}`}
                >
                  <X size={14} color="red" />
                </button>
              </span>
            ))}
          </div>
        </div>
        {/* Canonical URL */}
        <div className="space-y-2">
          <Label htmlFor="canonicalUrl" className="text-gray-500">
            Canonical URL
          </Label>
          <p className="text-gray-500 text-sm">
            Remove symbols like /, @, #, !, $, %, ^, &, *, (, ), +, =, [, ], |,
            :, ;, &apos;, &quot;, &lt;, &gt;, ,, ?, and ~.
          </p>
          <div className="relative">
            <InputField
              control={control}
              errors={errors}
              disabled_path={disabled_path === "canonical-url" ? true : false}
              name={"metaCanonicalUrl" as Path<T>}
              type="text"
              inputStyle="text-gray-500 placeholder-gray-200 bg-transparent border-zinc-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOForm;
