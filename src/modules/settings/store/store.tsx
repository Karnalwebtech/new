"use client";
import React, { memo } from "react";
import { CurrenciesTable } from "./currencies-table";
import { useGetStoreDataQuery } from "@/state/store-api";
import { StoreDetails } from "./store-details";

const Store = () => {
  const { data, isLoading } = useGetStoreDataQuery();
  const result = data?.result;
  return (
    <div className="space-y-6">
      <StoreDetails store={result!} isLoading={isLoading} />
      <CurrenciesTable />
    </div>
  );
};

export default memo(Store);
