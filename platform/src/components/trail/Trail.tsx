import { useMemo } from "react";
import type { Level } from "@/lib/types";
import { TIERS } from "@/lib/meta";
import { TrailTierSection } from "./TrailTierSection";

export interface TrailProps {
  levels: Level[];
  onSelect: (id: string) => void;
}

export function Trail({ levels, onSelect }: TrailProps) {
  const doneIds = useMemo(
    () => new Set(levels.filter((l) => l.status === "done").map((l) => l.id)),
    [levels],
  );

  // The "current" level — the next unlocked pending level in the lowest-tier
  // order. Matches the ContinueCard logic so the marker agrees with the hero.
  const currentId = useMemo(() => {
    const inProgress = levels.find((l) => l.status === "in-progress");
    if (inProgress) return inProgress.id;
    const sorted = [...levels].sort((a, b) =>
      a.tier !== b.tier ? a.tier - b.tier : a.id.localeCompare(b.id),
    );
    const next = sorted.find(
      (l) => l.status !== "done" && l.prereqs.every((p) => doneIds.has(p)),
    );
    return next?.id ?? null;
  }, [levels, doneIds]);

  const byTier = useMemo(() => {
    const grouped = new Map<number, Level[]>();
    for (const l of levels) {
      const arr = grouped.get(l.tier) ?? [];
      arr.push(l);
      grouped.set(l.tier, arr);
    }
    for (const arr of grouped.values()) arr.sort((a, b) => a.id.localeCompare(b.id));
    return grouped;
  }, [levels]);

  return (
    <div className="mt-8 flex flex-col gap-20">
      {TIERS.map((tier) => (
        <TrailTierSection
          key={tier.id}
          tier={tier}
          levels={byTier.get(tier.id) ?? []}
          doneIds={doneIds}
          currentId={currentId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
