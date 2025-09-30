import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import React from "react";
import ProductTypesDetails from "../../../../modules/settings/product-types/product-types-details";
export const metadata = buildMetadata({
  title: "Product types details",
  description: "Product types details",
  siteName: siteName,
});

const Page = async ({ params }: { params: Promise<{ edit: string }> }) => {
  const { edit } = await params; // 👈 await here
  return (
    <>
      <ProductTypesDetails ItemId={edit} />
    </>
  );
};

export default Page;
