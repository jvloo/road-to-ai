import metaJson from "../../../curriculum/meta.json";

export interface TierMeta {
  id: number;
  name: string;
  accent: string;
  blurb: string;
}

export interface TierBand {
  name: string;
  min_xp: number;
}

export const TIERS: TierMeta[] = metaJson.tiers as TierMeta[];
export const TIER_BANDS: TierBand[] = metaJson.tier_bands as TierBand[];

export function tierById(id: number): TierMeta | undefined {
  return TIERS.find((t) => t.id === id);
}

export function bandForXp(xp: number): { curr: TierBand; next: TierBand | null } {
  let curr: TierBand = TIER_BANDS[0] as TierBand;
  let next: TierBand | null = TIER_BANDS[1] ?? null;
  for (let i = 0; i < TIER_BANDS.length; i++) {
    const band = TIER_BANDS[i] as TierBand;
    if (xp >= band.min_xp) {
      curr = band;
      next = TIER_BANDS[i + 1] ?? null;
    }
  }
  return { curr, next };
}
