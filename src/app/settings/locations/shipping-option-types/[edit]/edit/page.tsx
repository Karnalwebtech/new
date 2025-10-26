import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import CreateShippingOptionType from "@/modules/settings/locations/shipping-option-types/edit/create-shippig-option-type";
import React from "react";
export const metadata = buildMetadata({
  title: "Update shipping profile",
  description: "Update shipping profile",
  siteName: siteName,
});

const Page = async ({ params }: { params: Promise<{ edit: string }> }) => {
  const { edit } = await params; // 👈 await here
  return (
    <>
       <Header
           breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Locations & Shipping", path: "/settings/locations" },
          {
            label: "Shipping option type",
            path: "/settings/locations/shipping-option-type",
          },
           {
            label: "Update shipping option type",
            path: "/settings/locations/shipping-option-type/Update",
          },
        ]}
      />
      <CreateShippingOptionType ItemId={edit}  />
    </>
  );
};

export default Page;
