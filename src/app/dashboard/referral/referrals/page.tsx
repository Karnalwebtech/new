import type { Metadata } from "next";
import { Header } from "@/modules/layout/header/header";
import { Referrals } from "@/modules/dashboard/referral/referrals/referrals";

export const metadata: Metadata = {
  title: "Rewards",
  description: "View and manage your rewards",
};

export default function RewardsPage() {
  return (
    <>
      <Header
        breadcrumbData={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Referral Dashboard", path: "/dashboard/referral" },
          { label: "Referrals", path: "/dashboard/referral/referrals" },
        ]}
      />
      <Referrals />
    </>
  );
}
