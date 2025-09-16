import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import CreateRegion from "@/modules/settings/regions/edit/create-region";
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
          { label: "Regions", path: "/settings/regions" },
          { label: "Edit", path: "/settings/regions/edit" },
        ]}
      />
      <CreateRegion ItemId={edit} />
    </>
  );
};

export default Page;
