import { AppShell } from "@/components/shared/appShell";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="client">{children}</AppShell>;
}
