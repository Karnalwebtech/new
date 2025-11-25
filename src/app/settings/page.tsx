import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings",
  openGraph: {
    title: "Settings",
    description: "Manage store settings",
  },
};


export default function Page() {
  // redirect immediately
  redirect("/settings/store");
}
