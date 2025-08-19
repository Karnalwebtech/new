"use client"
import React, { memo } from "react";
import PostList from "./post-list";
import NavigateBtn from "@/components/buttons/navigate-btn";
import { Plus } from "lucide-react";

const Post = () => {

  return (
    <>
      <div className="w-[150px] p-4">
        <NavigateBtn
          path={"/dashboard/post/add-new"}
          Icon={Plus}
          title="Add new"
          style={"border bg-gray-900 text-gray-100"}
        />
      </div>
      <PostList />
    </>
  );
};

export default memo(Post);
