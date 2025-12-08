import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import ProductTagDetails from "@/modules/settings/product-tag/product-tag-details";
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
      <ProductTagDetails ItemId={edit} />
    </>
  );
};

export default Page;
