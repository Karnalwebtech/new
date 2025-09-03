import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings",
};

export default function Page() {
  // redirect immediately
  redirect("/settings/store");
}
