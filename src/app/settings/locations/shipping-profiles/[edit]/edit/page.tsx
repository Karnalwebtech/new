import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import CreateShippingProfile from "@/modules/settings/locations/shipping-profiles/edit/create-shippig-profile";
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
            label: "Shipping profiles",
            path: "/settings/locations/shipping-profiles",
          },
           {
            label: "Update shipping profiles",
            path: "/settings/locations/shipping-profiles/Update",
          },
        ]}
      />
      <CreateShippingProfile ItemId={edit}  />
    </>
  );
};

export default Page;
