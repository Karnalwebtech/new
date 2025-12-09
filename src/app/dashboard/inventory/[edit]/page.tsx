import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import InventoryDetails from "@/modules/main/inventory/inventory-details";
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
          { label: "Product tag", path: "/settings/product-tags" },
          { label: "Create", path: "/settings/product-tags/create" },
        ]}
      />
      <InventoryDetails ItemId={edit} />
    </>
  );
};

export default Page;
