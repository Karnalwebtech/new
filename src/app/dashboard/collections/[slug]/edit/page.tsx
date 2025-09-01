import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import CollectionForm from "@/modules/main/collections/create/collection-create";
import React from "react";
export const metadata = buildMetadata({
  title: "Edit product Category",
  description: "Edit product Category",
  siteName: siteName,
});

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params; // 👈 await here

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
          {
            label: "Edit Collection",
            path: `/dashboard/collections/${slug}/edit`,
          },
        ]}
      />
      <CollectionForm ItemId={slug} />
    </>
  );
};

export default Page;
