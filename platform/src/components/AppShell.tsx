import type { ReactNode } from "react";
import { Header } from "./Header";

export interface AppShellProps {
  xp: number;
  tier: string;
  children: ReactNode;
}

export function AppShell({ xp, tier, children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <Header xp={xp} tier={tier} />
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-10">{children}</main>
    </div>
  );
}
