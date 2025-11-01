import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import FulfillmentProviderList from "@/modules/settings/locations/location-details/fulfillment-provider-list";
import React from "react";
export const metadata = buildMetadata({
  title: "Update region",
  description: "Update region",
  siteName: siteName,
});

const Page = async ({ params }: { params: Promise<{ edit: string }> }) => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Location", path: "/settings/locations" },
          { label: "Updte", path: "/settings/locations/create" },
        ]}
      />
      <FulfillmentProviderList />
    </>
  );
};

export default Page;
