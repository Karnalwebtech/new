import { Header } from "@/modules/layout/header/header";
import React from "react";
import ShippingOptionType from "@/modules/settings/locations/shipping-option-types/shipping-option-type";
const Page = () => {
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
        ]}
      />
      <ShippingOptionType />
    </>
  );
};

export default Page;
