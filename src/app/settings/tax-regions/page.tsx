import { Header } from "@/modules/layout/header/header";
import TaxRegions from "@/modules/settings/tax-regions/tax-regions";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Tax Regions",
  description: "Tax Regions",
};
const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Tax Regions", path: "/settings/tax-regions" },
        ]}
      />
      <TaxRegions />
    </>
  );
};

export default Page;
