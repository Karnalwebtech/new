import React, { memo } from "react";
import { StoreDetailsCard } from "./store-details-card";
import { CurrenciesTable } from "./currencies-table";

const Store = () => {
  return (
    <div className="space-y-6">
      <StoreDetailsCard />
      <CurrenciesTable />
    </div>
  );
};

export default memo(Store);
