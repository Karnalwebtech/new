import { Header } from "@/modules/layout/header/header";
import { AddNew } from "@/modules/superme/custom-storege-fields/add-new";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Add custom storage field",
  description: "Add custom storage field",
};

export default function Page() {
  return (<>
    <Header
      breadcrumbData={[
        { label: "Supreme", path: "/supreme" },
        { label: "Custom storage fields", path: "/supreme/custom-storage-fields" },
        { label: "Add storage fields", path: "/supreme/custom-storage-fields/add-new" },
      ]}
    />
    <AddNew />
  </>);
}
