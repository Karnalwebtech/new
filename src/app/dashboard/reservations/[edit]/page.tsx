import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import React from "react";
import ReservationsDetails from "../../../../modules/main/reservations/reservations-details";
export const metadata = buildMetadata({
  title: "Update region",
  description: "Update region",
  siteName: siteName,
});

const Page = async ({ params }: { params: Promise<{ edit: string }> }) => {
  const { edit } = await params; // 👈 await here
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Settings", path: "/settings" },
          { label: "Product tag", path: "/settings/product-tags" },
          { label: "Create", path: "/settings/product-tags/create" },
        ]}
      />
      <ReservationsDetails ItemId={edit} />
    </>
  );
};

export default Page;
