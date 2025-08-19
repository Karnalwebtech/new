import { DashboardHeader } from "@/modules/upstash-redis/dashboard/dashboard-header";
import { SettingsForm } from "@/modules/upstash-redis/dashboard/settings-form";

export default function SettingsPage() {
  return (
    // <DashboardShel>
    <>
      <DashboardHeader
        heading="Settings"
        text="Manage your Upstash Redis settings."
      />
      <div className="grid gap-10">
        <SettingsForm />
      </div>
    </>
    // </DashboardShell>
  );
}
