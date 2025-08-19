"use client";

import { memo } from "react";
import { useGetAllcategorieQuery } from "@/state/categorie-api";
import List from "./list";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { addCategory, removeCategory } from "@/reducers/list-slice";

interface CategoryProps {
  className?: string;
  listType: string;
  title: string;
}

const CategorieList = ({ listType, title }: CategoryProps) => {
  const dispatch = useDispatch();
  const selectedList = useSelector(
    (state: RootState) => state.lists.categories
  );
  const { data, isLoading } = useGetAllcategorieQuery({
    rowsPerPage: Number(100),
    page: 1,
    type: listType,
  });

  const result = data?.result || [];
  const handleCategoryChange = (id: string) => {
    if (selectedList.includes(id)) {
      dispatch(removeCategory(id));
    } else {
      dispatch(addCategory(id));
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
export default memo(CategorieList);
