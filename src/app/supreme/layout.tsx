import type { Metadata } from "next";
import { AppLayoutShell } from "../upstash-redis/app-layout-shell";
export const metadata: Metadata = {
  title: "Superme",
  description: "Superme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayoutShell>{children}</AppLayoutShell>;
}
