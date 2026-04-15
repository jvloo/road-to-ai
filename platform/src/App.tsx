import { Divider } from "./components/Divider";

export default function App() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-sm text-[var(--color-muted)]">// road-to-ai</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight">Road to AI</h1>
      <p className="mt-6 text-lg text-[var(--color-muted)]">
        A gamified, open-source path from math to world models — fork it and make your own.
      </p>

      <Divider>what this is</Divider>
      <p className="leading-relaxed">
        A reusable React platform that renders any markdown-based gamified curriculum as
        an interactive skill tree with levels, XP, achievements, and spaced recall — plus
        a flagship AI curriculum as the default example.
      </p>

      <Divider>status</Divider>
      <ul className="space-y-2 font-mono text-sm">
        <li>
          <span className="text-[var(--color-accent)]">●</span> m1 scaffold · online
        </li>
        <li className="text-[var(--color-muted)]">○ m2 skill tree · in progress</li>
        <li className="text-[var(--color-muted)]">○ m3 gamification · queued</li>
        <li className="text-[var(--color-muted)]">○ m4 flagship content · queued</li>
      </ul>

      <Divider>links</Divider>
      <ul className="space-y-1 text-sm">
        <li>
          <a className="underline hover:text-[var(--color-accent)]" href="https://github.com/jvloo/road-to-ai">
            GitHub: jvloo/road-to-ai
          </a>
        </li>
        <li>
          <a className="underline hover:text-[var(--color-accent)]" href="https://xavierloo.com">
            Author: Xavier Loo
          </a>
        </li>
      </ul>
    </main>
  );
}
