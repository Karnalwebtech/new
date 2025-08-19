import { Header } from "@/modules/layout/header/header"
import Dashboard from "@/modules/dashboard/referral/dashboard/dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Referral Dashboard",
  description: "Track and manage your referrals",
}

export default function DashboardPage() {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Referral Dashboard", path: "/dashboard/referral" },
        ]}
      />
      <div className="flex min-h-screen flex-col">
        <Dashboard />
      </div>
    </>
  )
}

