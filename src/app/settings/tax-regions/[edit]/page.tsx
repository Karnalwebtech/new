import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import TaxRegionDetails from "@/modules/settings/tax-regions/tax-region-details";
import React from "react";
export const metadata = buildMetadata({
  title: "Preview tax region",
  description: "Preview tax region",
  siteName: siteName,
});

const Page = async ({ params }: { params: Promise<{ edit: string }> }) => {
  const { edit } = await params; // 👈 await here
  return (
    <>
      <TaxRegionDetails ItemId={edit} />
    </>
  );
};

export default Page;
