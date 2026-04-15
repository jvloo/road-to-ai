import { useEffect, useState } from "react";
import { browserTranslate, googleTranslateUrl, hasBrowserTranslator, loadSettings } from "@/lib/translate";

export function SelectionPopover() {
  const [text, setText] = useState<string>("");
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);

  useEffect(() => {
    const onUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) { setPos(null); setText(""); setTranslation(null); return; }
      const raw = sel.toString().trim();
      if (!raw || raw.length < 2) return;
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setText(raw);
      setPos({ x: rect.left + rect.width / 2, y: rect.top });
      setTranslation(null);
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, []);

  if (!pos || !text) return null;

  const onTranslate = async () => {
    const settings = loadSettings();
    if (settings.translation_provider === "external" || !hasBrowserTranslator()) {
      window.open(googleTranslateUrl(text, settings.target_language), "_blank", "noopener");
      return;
    }
    const t = await browserTranslate(text, settings.target_language);
    setTranslation(t ?? "translation failed · open in Google Translate");
  };

  const onCopy = () => { void navigator.clipboard.writeText(text); };

  return (
    <div
      className="fixed z-30 flex gap-1 rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-1 font-mono text-xs shadow-md"
      style={{ left: pos.x, top: pos.y - 44, transform: "translate(-50%, 0)" }}
    >
      <button onClick={onTranslate} className="rounded px-2 py-1 hover:bg-[var(--color-border)]">
        translate
      </button>
      <button onClick={onCopy} className="rounded px-2 py-1 hover:bg-[var(--color-border)]">copy</button>
      {translation && (
        <div className="absolute top-full mt-1 max-w-xs rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-2 text-sm">
          {translation}
        </div>
      )}
    </div>
  );
}
