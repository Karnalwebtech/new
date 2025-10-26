import { Header } from "@/modules/layout/header/header";
import CreateShippingProfile from "@/modules/settings/locations/shipping-profiles/edit/create-shippig-profile";
import React from "react";

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
           {
            label: "Add shipping profiles",
            path: "/settings/locations/shipping-profiles/create",
          },
        ]}
      />
      <CreateShippingProfile />
    </>
  );
};

export default Page;
