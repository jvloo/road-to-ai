import { useState } from "react";
import { loadSettings, saveSettings, type SettingsState } from "@/lib/translate";
import { Divider } from "./Divider";

const LANGUAGES = [
  ["en", "English"], ["zh", "中文 (Chinese)"], ["ja", "日本語 (Japanese)"],
  ["ko", "한국어 (Korean)"], ["es", "Español"], ["fr", "Français"],
  ["de", "Deutsch"], ["pt", "Português"], ["ru", "Русский"], ["ar", "العربية"],
];

export function Settings() {
  const [s, setS] = useState<SettingsState>(loadSettings());
  const update = (partial: Partial<SettingsState>) => {
    const next = { ...s, ...partial };
    setS(next);
    saveSettings(next);
    if (partial.theme !== undefined) {
      document.documentElement.classList.remove("dark", "light");
      if (partial.theme !== "system") {
        document.documentElement.classList.add(partial.theme);
      }
    }
  };
  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">// settings</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Settings</h1>

      <Divider>appearance</Divider>
      <label className="block text-sm">theme
        <select value={s.theme} onChange={(e) => update({ theme: e.target.value as "dark" | "light" | "system" })} className="ml-2 rounded border border-[var(--color-border)] bg-transparent p-1 font-mono text-xs">
          <option value="dark">dark (default)</option>
          <option value="light">light</option>
          <option value="system">system</option>
        </select>
      </label>

      <Divider>translation</Divider>
      <label className="block text-sm">target language
        <select value={s.target_language} onChange={(e) => update({ target_language: e.target.value })} className="ml-2 rounded border border-[var(--color-border)] bg-transparent p-1 font-mono text-xs">
          {LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
      </label>
      <label className="mt-3 block text-sm">provider
        <select value={s.translation_provider} onChange={(e) => update({ translation_provider: e.target.value as SettingsState["translation_provider"] })} className="ml-2 rounded border border-[var(--color-border)] bg-transparent p-1 font-mono text-xs">
          <option value="auto">auto · browser if available, else external</option>
          <option value="browser">browser only</option>
          <option value="external">always open Google Translate</option>
          <option value="api">api key (advanced)</option>
        </select>
      </label>

      <Divider>sound</Divider>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={s.sound} onChange={(e) => update({ sound: e.target.checked })} />
        enable completion chime (default off)
      </label>
    </main>
  );
}
