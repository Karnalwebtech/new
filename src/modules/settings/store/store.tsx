"use client";
import React, { memo } from "react";
import { useGetStoreDataQuery } from "@/state/store-api";
import { StoreDetails } from "./store-details";
import StoreCurrencies from "./store-currencies";

const Store = () => {
  const { data, isLoading } = useGetStoreDataQuery();
  const result = data?.result;
  return (
    <div className="space-y-6">
      <StoreDetails store={result!} isLoading={isLoading} />
      <StoreCurrencies />
    </div>
  );
};

export default memo(Store);
