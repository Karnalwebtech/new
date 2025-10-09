import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import CreateTaxRegion from "@/modules/settings/tax-regions/edit/tax-create-region";
import React from "react";
export const metadata = buildMetadata({
  title: "Update region",
  description: "Update region",
  siteName: siteName,
});

const Page = async ({ params }: { params: Promise<{ edit: string }> }) => {
  const { edit } = await params; // 👈 await here
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Tax Regions", path: "/settings/tax-regions" },
          { label: "Edit", path: "/settings/tax-regions/edit" },
        ]}
      />
      <CreateTaxRegion ItemId={edit} />
    </>
  );
};

export default Page;
