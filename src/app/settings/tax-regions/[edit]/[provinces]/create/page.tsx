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

const Page = async ({ params }: { params: Promise<{ edit: string ,provinces:string}> }) => {
  const {provinces,edit} = await params; // 👈 await here
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Tax Regions", path: "/settings/tax-regions" },
          {
            label: "Provinces",
            path: "/settings/tax-regions/provinces/create",
          },
        ]}
      />
      <CreateTaxRegion Provinces={provinces} parentId={edit}/>
    </>
  );
};

export default Page;
