import type { Metadata } from "next";
import { AppLayoutShell } from "./app-layout-shell";
export const metadata: Metadata = {
  title: "Settings",
  description: "Settings",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayoutShell>{children}</AppLayoutShell>;
}
