import { Header } from "@/modules/layout/header/header"
import EnventIndex from "@/modules/tracking-events/envent-index"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Post event tracking dashboard",
  description: "Post event tracking dashboard",
};
export default function DashboardPage() {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Tracking Events", path: "/dashboard/tracking-events" },
        ]}
      />
      <EnventIndex />
    </>
  )
}
