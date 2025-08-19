import type React from "react"
import { AppLayoutShell } from "./app-layout-shell"

export const metadata = {
  title: "Upstash Redis Dashboard",
  description: "A dashboard for managing Upstash Redis instances",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayoutShell>{children}</AppLayoutShell>;
}
