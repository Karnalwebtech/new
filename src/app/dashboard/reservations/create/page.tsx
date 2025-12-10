import { Header } from "@/modules/layout/header/header";
import CreateInventory from "@/modules/main/inventory/edit/create-inventory";
import React from "react";
import CreateReservations from "../../../../modules/main/reservations/edit/create-reservations";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Product tag", path: "/settings/product-tags" },
          { label: "Create", path: "/settings/product-tags/create" },
        ]}
      />
      <CreateReservations />
    </>
  );
};

export default Page;
