export type Track = "A" | "B";
export type LevelStatus = "pending" | "in-progress" | "done";

export type QuizType = "self-attest" | "multiple-choice" | "free-text";

export interface QuizQuestion {
  q: string;
  type: QuizType;
  choices?: string[];
  answer?: number;
}

export interface LevelFrontmatter {
  id: string;
  title: string;
  track: Track;
  tier: number;
  xp: number;
  prereqs: string[];
  unlocks: string[];
  status: LevelStatus;
  completed_at: string | null;
  tags?: string[];
  achievements?: string[];
  luminary?: string | null;
  glossary_terms?: string[];
  recall_of?: string[];
  quiz?: QuizQuestion[];
}

export interface Level extends LevelFrontmatter {
  body: string;
  slug: string;
  sourcePath: string;
}

export interface CurriculumMeta {
  version: number;
  tiers: Array<{
    id: number;
    name: string;
    accent: string;
  }>;
  tier_bands: Array<{
    name: string;
    min_xp: number;
  }>;
}
