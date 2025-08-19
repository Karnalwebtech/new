import { UserProfile } from "@/modules/main/account/user-profile";
import { Header } from "@/modules/layout/header/header"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Account",
    description: "My Account",
  };

export default function AccountPage() {
    return (
        <>
            <Header breadcrumbData={[{ label: "Dashboard", path: "/dashboard" }, { label: "Account", path: "/dashboard/account" }]} />
            <UserProfile />
        </>
      
    )
}

