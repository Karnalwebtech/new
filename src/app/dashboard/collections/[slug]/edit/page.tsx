import { siteName } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { Header } from "@/modules/layout/header/header";
import ProductCategoryForm from "@/modules/main/products/categories/create/category-create";
import React from "react";
export const metadata = buildMetadata({
  title: "Edit product Category",
  description: "Edit product Category",
  siteName: siteName,
});

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params; // 👈 await here

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
   {
            label: "Edit Category",
            path: `/dashboard/products/categories/${slug}/edit`,
          },
        ]}
      />
      <ProductCategoryForm catId={slug}/>
    </>
  );
};

export default Page;
