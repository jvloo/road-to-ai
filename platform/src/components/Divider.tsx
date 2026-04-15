import type { ReactNode } from "react";

export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 mb-3">
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">
        {`// ${children}`}
      </p>
      <hr className="mt-2 border-[var(--color-border)]" />
    </div>
  );
}
