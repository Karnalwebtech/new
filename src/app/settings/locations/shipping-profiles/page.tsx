import { Header } from "@/modules/layout/header/header";
import React from "react";
import ShippingProfile from "@/modules/settings/locations/shipping-profiles/shopping-profile";
const Page = () => {
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
        ]}
      />
      <ShippingProfile />
    </>
  );
};

export default Page;
