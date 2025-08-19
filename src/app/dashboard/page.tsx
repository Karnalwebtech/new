import { DashboardPage } from "@/modules/dashboard/dashboard-page";
import { Header } from "@/modules/layout/header/header";
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
}

export default function Page() {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
        ]}
      />

    <DashboardPage/>
    </>
  );
}
