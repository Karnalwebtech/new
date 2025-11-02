import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import SaleChannelsList from "@/modules/settings/locations/location-details/sale-channels-list";
import React from "react";
export const metadata = buildMetadata({
  title: "Update region",
  description: "Update region",
  siteName: siteName,
});

const Page = async ({ params }: { params: Promise<{ edit: string,sale_channel_id: string }> }) => {
  const { edit,sale_channel_id   } = await params; // 👈 await here
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Location", path: "/settings/locations" },
          { label: "Updte", path: "/settings/locations/create" },
        ]}
      />
      <SaleChannelsList itemId={edit} stockid={sale_channel_id}/>
    </>
  );
};

export default Page;
