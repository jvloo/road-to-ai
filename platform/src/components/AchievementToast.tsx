import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export interface ToastItem {
  id: string;
  title: string;
  subtitle?: string;
}

export interface AchievementToastProps {
  queue: ToastItem[];
  onDismiss: (id: string) => void;
}

export function AchievementToast({ queue, onDismiss }: AchievementToastProps) {
  return (
    <div
      className="pointer-events-none fixed right-6 top-20 z-50 flex w-80 max-w-[calc(100vw-3rem)] flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence initial={false}>
        {queue.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    if (hovering) return;
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [hovering, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="pointer-events-auto flex items-start gap-3 rounded-lg border border-[var(--color-accent)]/40 bg-[var(--color-surface-1)] p-4"
      style={{ boxShadow: "var(--shadow-card), 0 0 24px var(--color-accent-glow)" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      role="status"
    >
      <span
        aria-hidden
        className="mt-0.5 text-lg text-[var(--color-accent)]"
        style={{ textShadow: "0 0 8px var(--color-accent-glow-strong)" }}
      >
        ◆
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
          // achievement unlocked
        </p>
        <p className="mt-1 text-sm font-semibold text-[var(--color-fg-strong)]">
          {toast.title}
        </p>
        {toast.subtitle && (
          <p className="mt-1 text-xs text-[var(--color-muted)]">{toast.subtitle}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="font-mono text-xs text-[var(--color-fg-faint)] hover:text-[var(--color-fg)]"
      >
        ×
      </button>
    </motion.div>
  );
}
