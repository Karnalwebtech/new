import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import CreateProductType from "@/modules/settings/product-types/edit/create-product-type";
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
          { label: "Product type", path: "/settings/product-types" },
          { label: "Edit", path: "/settings/product-types/edit" },
        ]}
      />
      <CreateProductType ItemId={edit} />
    </>
  );
};

export default Page;
