import { StorageDashboard } from "@/modules/dashboard/storage/storage-dashboard";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Storage",
  description: "Storage",
};
export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <StorageDashboard />
    </main>
  );
}
