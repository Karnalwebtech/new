import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import CreateFulfillmentSetAreaZone from "@/modules/settings/locations/location-details/edit/create-fulfillment-set-area-zone";
import React from "react";
export const metadata = buildMetadata({
  title: "Update region",
  description: "Update region",
  siteName: siteName,
});

const Page = async ({
  params,
}: {
  params: Promise<{ edit: string; fulfillment_set_id: string,servise_zone_id:string }>;
}) => {
  const { edit, fulfillment_set_id,servise_zone_id } = await params;
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Location", path: "/settings/locations" },
          { label: "Updte", path: "/settings/locations/create" },
        ]}
      />
      <CreateFulfillmentSetAreaZone
        itemId={edit}
        fullfillment_set_id={fulfillment_set_id}
        servise_zone_id={servise_zone_id}
      />
    </>
  );
};

export default Page;
