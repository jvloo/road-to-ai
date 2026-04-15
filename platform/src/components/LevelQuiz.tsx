import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";
import { Divider } from "./Divider";

export function LevelQuiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  return (
    <section>
      <Divider>quiz</Divider>
      <ol className="space-y-4">
        {questions.map((q, i) => (
          <li key={i}>
            <p className="font-medium">{q.q}</p>
            {q.type === "self-attest" && (
              <div className="mt-1 flex gap-2 font-mono text-xs">
                <button className="rounded border border-[var(--color-border)] px-2 py-1" onClick={() => setAnswers((a) => ({ ...a, [i]: "yes" }))}>
                  yes · i can explain this
                </button>
                <button className="rounded border border-[var(--color-border)] px-2 py-1" onClick={() => setAnswers((a) => ({ ...a, [i]: "no" }))}>
                  not yet
                </button>
                {answers[i] && <span className="ml-2 text-[var(--color-muted)]">recorded</span>}
              </div>
            )}
            {q.type === "multiple-choice" && q.choices && (
              <ul className="mt-1 space-y-1 text-sm">
                {q.choices.map((c, idx) => {
                  const selected = answers[i] === String(idx);
                  const correct = revealed[i] && idx === q.answer;
                  const wrong = revealed[i] && selected && idx !== q.answer;
                  return (
                    <li key={idx}>
                      <button
                        onClick={() => { setAnswers((a) => ({ ...a, [i]: String(idx) })); setRevealed((r) => ({ ...r, [i]: true })); }}
                        className={`w-full rounded border px-2 py-1 text-left ${
                          correct ? "border-[var(--color-accent)] text-[var(--color-accent)]" : wrong ? "border-red-500 text-red-500" : "border-[var(--color-border)]"
                        }`}
                      >
                        {c}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
