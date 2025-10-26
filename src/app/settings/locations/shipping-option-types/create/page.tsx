import { Header } from "@/modules/layout/header/header";
import CreateShippingOptionType from "@/modules/settings/locations/shipping-option-types/edit/create-shippig-option-type";
import React from "react";

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
           {
            label: "Add shipping option type",
            path: "/settings/locations/shipping-option-type/create",
          },
        ]}
      />
      <CreateShippingOptionType />
    </>
  );
};

export default Page;
