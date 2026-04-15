import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import { AppShell } from "@/components/AppShell";
import { loadGlossary, type GlossaryEntry } from "@/lib/glossary";
import { loadSettings, saveSettings, type SettingsState } from "@/lib/translate";
import { bandForXp } from "@/lib/meta";
import type { Level } from "@/lib/types";

type Tab = "luminaries" | "glossary" | "settings";

function parseTab(hash: string): Tab {
  const m = hash.match(/tab=([a-z]+)/);
  const t = m?.[1];
  if (t === "glossary" || t === "settings") return t;
  return "luminaries";
}

export function LibraryPage() {
  const levels = useStore((s) => s.levels);
  const progress = useStore((s) => s.progress);
  const load = useStore((s) => s.load);
  const [tab, setTab] = useState<Tab>(
    parseTab(typeof window !== "undefined" ? window.location.hash : ""),
  );

  useEffect(() => {
    void load();
    const onHash = () => setTab(parseTab(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [load]);

  const band = useMemo(() => bandForXp(progress.xp_total).curr, [progress.xp_total]);
  const switchTo = (t: Tab) => {
    window.location.hash = `#/library?tab=${t}`;
  };

  const tabs: Array<{ id: Tab; label: string; caption: string }> = [
    { id: "luminaries", label: "Luminaries", caption: "the people you'll meet" },
    { id: "glossary", label: "Glossary", caption: "vocabulary you'll learn" },
    { id: "settings", label: "Settings", caption: "knobs you can tune" },
  ];
  const activeCaption = tabs.find((t) => t.id === tab)?.caption ?? "";

  return (
    <AppShell xp={progress.xp_total} tier={band.name}>
      <header className="pt-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          // library
        </p>
        <h1
          className="mt-3 font-semibold tracking-tight text-[var(--color-fg-strong)]"
          style={{ fontSize: "var(--text-title)", lineHeight: 1.1 }}
        >
          Library
        </h1>
        <p className="mt-3 max-w-xl text-sm text-[var(--color-muted)]">{activeCaption}.</p>
      </header>

      <nav
        role="tablist"
        aria-label="Library sections"
        className="mt-8 flex gap-6 border-b border-[var(--color-border)] font-mono text-xs uppercase tracking-wider"
      >
        {tabs.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => switchTo(t.id)}
              className={`-mb-px border-b-2 px-1 py-3 transition-colors ${
                active
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-fg)]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-10">
        {tab === "luminaries" && <LuminariesPanel levels={levels} />}
        {tab === "glossary" && <GlossaryPanel />}
        {tab === "settings" && <SettingsPanel />}
      </div>
    </AppShell>
  );
}

function LuminariesPanel({ levels }: { levels: Level[] }) {
  const byName = useMemo(() => {
    const map = new Map<string, Level[]>();
    for (const l of levels) {
      if (!l.luminary) continue;
      const list = map.get(l.luminary) ?? [];
      list.push(l);
      map.set(l.luminary, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [levels]);

  if (byName.length === 0) {
    return (
      <p className="font-mono text-xs text-[var(--color-muted)]">
        // no luminaries yet — authors, add a `luminary:` frontmatter field
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {byName.map(([name, entries]) => {
        const initials = name
          .split(/\s+/)
          .map((p) => p[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        return (
          <li
            key={name}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-5 transition-colors hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-surface-2)]"
          >
            <div className="flex items-center gap-4">
              <span
                aria-hidden
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] font-mono text-sm font-semibold text-[var(--color-accent)]"
              >
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-[var(--color-fg-strong)]">
                  {name}
                </p>
                <p className="truncate font-mono text-[11px] text-[var(--color-muted)]">
                  met on {entries.map((e) => e.id).join(" · ")}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function GlossaryPanel() {
  const [entries, setEntries] = useState<GlossaryEntry[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    void loadGlossary().then((e) =>
      setEntries(e.sort((a, b) => a.term.localeCompare(b.term))),
    );
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) => e.term.toLowerCase().includes(q) || e.body.toLowerCase().includes(q),
    );
  }, [entries, query]);

  return (
    <div>
      <input
        type="search"
        placeholder="Search terms…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md rounded-md border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-faint)] focus:border-[var(--color-accent)] focus:outline-none"
      />
      <dl className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((e) => (
          <div
            key={e.term}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-5"
          >
            <dt className="font-mono text-sm font-semibold text-[var(--color-fg-strong)]">
              {e.term}
            </dt>
            <dd
              className="prose prose-invert prose-sm mt-2 max-w-none text-[var(--color-muted)]"
              dangerouslySetInnerHTML={{ __html: e.body }}
            />
          </div>
        ))}
      </dl>
      {filtered.length === 0 && entries.length > 0 && (
        <p className="mt-8 font-mono text-xs text-[var(--color-muted)]">
          // no matches for "{query}"
        </p>
      )}
    </div>
  );
}

const LANGUAGES: Array<[string, string]> = [
  ["en", "English"],
  ["zh", "中文 (Chinese)"],
  ["ja", "日本語 (Japanese)"],
  ["ko", "한국어 (Korean)"],
  ["es", "Español"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["pt", "Português"],
  ["ru", "Русский"],
  ["ar", "العربية"],
];

function SettingsPanel() {
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

  const field = "rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-1.5 font-mono text-xs text-[var(--color-fg)] focus:border-[var(--color-accent)] focus:outline-none";

  return (
    <div className="max-w-xl space-y-8">
      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
          // appearance
        </h2>
        <label className="mt-3 flex items-center justify-between gap-4 text-sm">
          <span className="text-[var(--color-fg)]">theme</span>
          <select
            value={s.theme}
            onChange={(e) => update({ theme: e.target.value as "dark" | "light" | "system" })}
            className={field}
          >
            <option value="dark">dark (default)</option>
            <option value="light">light</option>
            <option value="system">system</option>
          </select>
        </label>
      </section>

      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
          // translation
        </h2>
        <label className="mt-3 flex items-center justify-between gap-4 text-sm">
          <span className="text-[var(--color-fg)]">target language</span>
          <select
            value={s.target_language}
            onChange={(e) => update({ target_language: e.target.value })}
            className={field}
          >
            {LANGUAGES.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-3 flex items-center justify-between gap-4 text-sm">
          <span className="text-[var(--color-fg)]">provider</span>
          <select
            value={s.translation_provider}
            onChange={(e) =>
              update({
                translation_provider: e.target.value as SettingsState["translation_provider"],
              })
            }
            className={field}
          >
            <option value="auto">auto · browser if available, else external</option>
            <option value="browser">browser only</option>
            <option value="external">always open Google Translate</option>
            <option value="api">api key (advanced)</option>
          </select>
        </label>
      </section>

      <section>
        <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
          // sound
        </h2>
        <label className="mt-3 flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={s.sound}
            onChange={(e) => update({ sound: e.target.checked })}
            className="h-4 w-4 accent-[var(--color-accent)]"
          />
          <span className="text-[var(--color-fg)]">enable completion chime (default off)</span>
        </label>
      </section>
    </div>
  );
}
