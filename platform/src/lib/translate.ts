export type TranslationProvider = "auto" | "browser" | "external" | "api";

export interface SettingsState {
  theme: "dark" | "light" | "system";
  target_language: string;
  translation_provider: TranslationProvider;
  api_key?: string;
  sound: boolean;
}

const KEY = "road-to-ai:settings:v1";

export function loadSettings(): SettingsState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as SettingsState;
  } catch { /* ignore */ }
  return {
    theme: "dark",
    target_language: navigator.language.split("-")[0] ?? "en",
    translation_provider: "auto",
    sound: false,
  };
}

export function saveSettings(s: SettingsState): void {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function hasBrowserTranslator(): boolean {
  return typeof (self as unknown as { translation?: unknown }).translation !== "undefined";
}

export async function browserTranslate(text: string, target: string): Promise<string | null> {
  const api = (self as unknown as {
    translation?: {
      createTranslator(init: unknown): Promise<{ translate(s: string): Promise<string> }>;
    };
  }).translation;
  if (!api) return null;
  try {
    const translator = await api.createTranslator({ sourceLanguage: "auto", targetLanguage: target });
    return await translator.translate(text);
  } catch {
    return null;
  }
}

export function googleTranslateUrl(text: string, target: string): string {
  const u = new URL("https://translate.google.com/");
  u.searchParams.set("sl", "auto");
  u.searchParams.set("tl", target);
  u.searchParams.set("text", text);
  u.searchParams.set("op", "translate");
  return u.toString();
}
