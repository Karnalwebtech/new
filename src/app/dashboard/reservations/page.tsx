import { Header } from "@/modules/layout/header/header";
import React from "react";
import Reservations from "../../../modules/main/reservations/reservations";

const Page = () => {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Blog post", path: "/dashboard/post" },
        ]}
      />
      <Reservations/>
    </>
  );
};

export default Page;
