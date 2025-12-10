import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import React from "react";
import CreateReservations from "@/modules/main/reservations/edit/create-reservations";
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
          { label: "Edit", path: "/settings/product-tags/edit" },
        ]}
      />
      <CreateReservations ItemId={edit} />
    </>
  );
};

export default Page;
