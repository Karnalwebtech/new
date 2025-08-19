import { EditProfile } from "@/modules/main/account/edit-profile/edit-profile";
import { Header } from "@/modules/layout/header/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit profile",
  description: "Edit profile",
};

export default function AccountPage() {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Account", path: "/dashboard/account" },
          { label: "Edit profile", path: "/dashboard/account/edit-profile" },
        ]}
      />
      <EditProfile />
    </>
  );
}
