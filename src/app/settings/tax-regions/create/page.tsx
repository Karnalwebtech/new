import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import CreateTaxRegion from "@/modules/settings/tax-regions/edit/tax-create-region";
import React from "react";
export const metadata = buildMetadata({
  title: "Create tax region",
  description: "Create tax region",
  siteName: siteName,
});
const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Tax Regions", path: "/settings/tax-regions" },
          { label: "Edit", path: "/settings/tax-regions/edit" },
        ]}
      />
      <CreateTaxRegion />
    </>
  );
};

export default Page;
