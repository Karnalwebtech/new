import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import SingleProductCategoryPage from "@/modules/main/products/categories/single-page/single-page";
import React from "react";
export const metadata = buildMetadata({
  title: "Product Categories Preview",
  description: "Product Categories Preview",
  siteName: siteName,
});
const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Products", path: "/dashboard/products" },
          { label: "Categories", path: "/dashboard/products/categories" },
          {
            label: "Categories Preview",
            path: `/dashboard/products/categories/${slug}`,
          },
        ]}
      />
      <SingleProductCategoryPage catId={slug} />
    </>
  );
};

export default Page;
