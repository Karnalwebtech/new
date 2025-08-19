"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Link2Icon, FileTextIcon } from "lucide-react";
import { PostForm } from "@/components/post/index-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SelectFields from "../fields/select-field";
import { FileHandler } from "../files/file-loader/file-handler";
import { DrawerComponent } from "../drawer/drawer-component";
import FileLoader from "../files/file-loader/file-loader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { close } from "@/reducers/healper-slice";
import Seo_form from "../forms/seo";
import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormSetValue,
} from "react-hook-form";
import { GeneralBtn } from "../buttons/general-btn";
import CategorieList from "./categorie-list";
import TagList from "./tag-list";

interface PostFromCardProps<T extends FieldValues> {
  errors: FieldErrors<T>; // react form
  control: Control<T>; // react form
  setValue: UseFormSetValue<T>; // react form
  setKeywords: (value: string[] | ((prev: string[]) => string[])) => void;
  keywords?: string[];
  isVisiableCategory?: boolean;
  isVisiableTag?: boolean;
  pageTitle: string;
  isLoading?: boolean;
  discard_link?: string;
  watchseoTitle?: string;
  watchseoDescription?: string;
  listType?: string;
}
export default function PostFromCardm<T extends FieldValues>({
  setValue,
  control,
  errors,
  isVisiableCategory = false,
  isVisiableTag = false,
  pageTitle,
  isLoading = false,
  discard_link,
  setKeywords,
  keywords,
  watchseoTitle = "",
  watchseoDescription = "",
  listType = "",
}: PostFromCardProps<T>) {
  const [postType, setPostType] = useState<string>(pageTitle);
  const isOpen = useSelector((state: RootState) => state?.helper?.isOpen);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(close());
  };

  const drop_down_selector = [
    {
      key: "published",
      value: "published",
    },
    {
      key: "draft",
      value: "draft",
    },
  ];
  return (
    <div className="min-h-screen text-white p-4">
      <Card className="mx-auto bg-black border-zinc-800">
        <CardContent className="p-6">
          <div className="block lg:flex gap-4">
            {/* Left Panel: Post Creation */}
            <div className="w-full lg:w-[70%]">
              <h1 className="text-gray-200 text-2xl">{pageTitle}</h1>
              <Tabs
                value={postType}
                onValueChange={setPostType}
                className="mb-6"
              >
                <TabsList className="bg-gray-700 my-2">
                  {[
                    { value: pageTitle, label: pageTitle, icon: FileTextIcon },
                    { value: "image", label: "Image", icon: ImageIcon },
                    { value: "seo", label: "SEO", icon: Link2Icon },
                  ].map(({ value, label, icon: Icon }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="data-[state=active]:bg-white hover:bg-gray-400 hover:text-black m-[2px]"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={pageTitle}>
                  <PostForm
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />
                </TabsContent>

                <TabsContent value="image">
                  <FileHandler
                    title={"Banner image"}
                    typeId={"banner_image"}
                    maxLimit={1}
                    category={"image"}
                  />
                </TabsContent>

                <TabsContent value="seo">
                  <Seo_form
                    control={control}
                    errors={errors}
                    setKeywords={setKeywords}
                    keywords={keywords || []}
                    title={watchseoTitle}
                    description={watchseoDescription}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Panel: Sharing Options */}
            <div className="w-full lg:w-[30%]">
              <div className="mb-4">
                <h3 className="text-gray-200 text-lg">Add Post Status</h3>
                <SelectFields
                  control={control}
                  errors={errors}
                  name={"status" as Path<T>}
                  placeholder="Select status" // Default placeholder
                  drop_down_selector={drop_down_selector}
                  class_style={"text-gray-200"}
                />
              </div>
              <div className="pb-4">
                {isVisiableCategory && <CategorieList listType={listType} title={"Categorie"}/>}
              </div>
              <div className="pb-4">
              {isVisiableTag && <TagList listType={listType} title={"Tag"}/>}
              </div>
              <FileHandler
                title={"Fetaure image"}
                typeId={"feature_image"}
                maxLimit={1}
                category={"image"}
              />
            </div>
          </div>

          <FooterActions
            isLoading={isLoading}
            discard_link={discard_link || ""}
          />
        </CardContent>
      </Card>
      <DrawerComponent
        title=""
        description=""
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <FileLoader />
      </DrawerComponent>
    </div>
  );
}

interface FooterActionsProps {
  isLoading: boolean;
  discard_link: string;
}
function FooterActions({ isLoading, discard_link }: FooterActionsProps) {
  const router = useRouter();
  return (
    <div className="flex justify-between mt-6 pt-6 border-t border-zinc-800">
      <p
        onClick={() => router.push(discard_link)}
        className="rounded text-black bg-gray-300 cursor-pointer px-[15px] m-0 py-[3px] pt-[7px]"
      >
        Discard
      </p>
      <div className="space-x-2 flex">
        <GeneralBtn
          title={"Post"}
          loader={isLoading}
          type={"submit"}
          style="bg-orange-600 w-[100px] relative hover:bg-orange-700 relative"
        />
      </div>
    </div>
  );
}
