import type { ReactNode } from "react";

export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="mt-12 mb-4">
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">
        {`// ${children}`}
      </p>
      <hr className="mt-2 border-[var(--color-border)]" />
    </div>
  );
}
