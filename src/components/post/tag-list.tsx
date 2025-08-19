"use client";

import { memo } from "react";
import List from "./list";
import { useGetAllTagQuery } from "@/state/tag-api";
import { addTag, removeTag } from "@/reducers/list-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

interface TagProps {
  className?: string;
  listType: string;
  title: string;
}

const TagList = ({ title, listType }: TagProps) => {
  const dispatch = useDispatch();
  const selectedList = useSelector((state: RootState) => state.lists.tags);

  const { data, isLoading } = useGetAllTagQuery({
    rowsPerPage: Number(100),
    page: 1,
    type: listType,
  });

  const result = data?.result || [];

  const handleCategoryChange = (id: string) => {
    if (selectedList.includes(id)) {
      dispatch(removeTag(id));
    } else {
      dispatch(addTag(id));
    }
  };

  return (
    <List
      selectedList={selectedList}
      result={result}
      isLoading={isLoading}
      title={title}
      handleCategoryChange={handleCategoryChange}
    />
  );
};
export default memo(TagList);
