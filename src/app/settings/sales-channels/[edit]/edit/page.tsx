import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import CreateRegion from "@/modules/settings/regions/edit/create-region";
import CreateSalesChannels from "@/modules/settings/sales-channels/edit/create-sales-channels";
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
          { label: "Sales Channels", path: "/settings/sales-channels" },
          { label: "Edit", path: "/settings/sales-channels/edit" },
        ]}
      />
      <CreateSalesChannels ItemId={edit} />
    </>
  );
};

export default Page;
