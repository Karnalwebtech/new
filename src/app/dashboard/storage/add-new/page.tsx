import { AddNew } from "@/modules/dashboard/storage/add-new/add-new";
import { Header } from "@/modules/layout/header/header";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Add new storage",
  description: "Add new storage",
};
export default function Page() {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Storage", path: "/dashboard/storage" },
          { label: "Add new", path: "/dashboard/storage/add-new" },
        ]}
      />
      <AddNew />
    </>
  );
}
