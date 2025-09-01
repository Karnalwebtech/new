import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import SingleProductCollectionPage from "@/modules/main/collections/single-page/single-page";
import React from "react";
export const metadata = buildMetadata({
  title: "Product Categories Preview",
  description: "Product Categories Preview",
  siteName: siteName,
});
const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Collections", path: "/dashboard/collections" },
          {
            label: "Collections Preview",
            path: `/dashboard/collections/${slug}`,
          },
        ]}
      />
      <SingleProductCollectionPage ItemId={slug} />
    </>
  );
};

export default Page;
