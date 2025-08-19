import type { Metadata } from "next";
import RewardsPage from "@/modules/dashboard/referral/rewards/reward";
import { Header } from "@/modules/layout/header/header";

export const metadata: Metadata = {
  title: "Rewards",
  description: "View and manage your rewards",
};

export default function Page() {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Referral Dashboard", path: "/dashboard/referral" },
          { label: "Rewards", path: "/dashboard/referral/rewards" },
        ]}
      />
      <RewardsPage />
    </>
  );
}
