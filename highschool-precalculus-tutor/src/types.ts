// Shared TypeScript types for the Pre-Calculus Tutor.

export type AnswerType = "multiple-choice" | "numeric";

export interface Choice {
  /** Display label, may contain $LaTeX$. */
  label: string;
  /** True for the one correct option. */
  correct?: boolean;
  /** If this distractor is chosen, the named misconception to surface. */
  misconception?: string;
}

/** A concrete, ready-to-render problem produced by a generator. */
export interface Problem {
  /** Question prompt, may contain $LaTeX$. */
  prompt: string;
  answerType: AnswerType;
  /** For multiple-choice problems. */
  choices?: Choice[];
  /** For numeric problems: the accepted value. */
  numericAnswer?: number;
  /** Optional human-readable form of the answer (for the worked solution). */
  answerDisplay?: string;
  /** Progressive hints, revealed one at a time. */
  hints: string[];
  /** Short worked explanation shown after the attempt. */
  explanation: string;
}

/** A generator builds a fresh randomized Problem each call. */
export type Generator = () => Problem;

export type ExampleType = "worked" | "completion" | "independent";

export interface Example {
  type: ExampleType;
  prompt: string;
  steps: string[];
  answer: string;
  /** Occasional "why does this work?" prompt. */
  selfExplain?: string;
}

export interface MasteryRule {
  requiredStreak: number;
  minLevel: number;
}

export interface Skill {
  id: string;
  name: string;
  /** Markdown + $LaTeX$ lesson text. */
  lesson: string;
  examples: Example[];
  /** Name of the generator in the generator registry. */
  generator: string;
  mastery: MasteryRule;
}

export interface Unit {
  id: string;
  title: string;
  blurb: string;
  mcpsStandards: string[];
  /** A unit that must be mastered before this one unlocks. null = always open. */
  requires: string | null;
  skills: Skill[];
}

// ---- Progress / mastery model (persisted in localStorage) ----

export interface SkillProgress {
  level: number; // 0..MAX_LEVEL
  dueAt: number; // epoch ms
  streak: number;
  attempts: number;
  correct: number;
  mastered: boolean;
}

export interface Progress {
  studentName: string;
  skills: Record<string, SkillProgress>;
  unlockedUnits: string[];
  lastOpened: string | null;
  updatedAt: string;
}
