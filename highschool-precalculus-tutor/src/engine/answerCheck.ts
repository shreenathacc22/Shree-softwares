// Answer checking. Multiple-choice = exact match with misconception lookup.
// Numeric = tolerant parse comparing equivalent forms (0.5 == 1/2).

import type { Problem, Choice } from "../types";

export interface CheckResult {
  correct: boolean;
  /** Named misconception for a wrong MC choice, if any. */
  misconception?: string;
}

/** Parse a numeric answer allowing fractions, decimals, and simple symbols. */
export function parseNumeric(raw: string): number | null {
  if (raw == null) return null;
  let s = raw.trim().toLowerCase();
  if (s === "") return null;
  s = s
    .replace(/\s+/g, "")
    .replace(/−/g, "-") // unicode minus
    .replace(/([)\d.])(pi|π)/g, "$1*$2") // implicit multiply: 2pi, 0.5pi, (3/4)pi
    .replace(/pi|π/g, String(Math.PI))
    .replace(/sqrt\(([^)]+)\)/g, (_, x) => String(Math.sqrt(Number(x))))
    .replace(/√\(?([0-9.]+)\)?/g, (_, x) => String(Math.sqrt(Number(x))));
  // Plain number fast-path.
  const n = Number(s);
  if (Number.isFinite(n)) return n;
  // General arithmetic expression: + - * / ( ) with digits, decimals, exponents.
  // Only allow numeric/operator characters so it's safe to evaluate.
  if (/^[-+*/().\d\seE]+$/.test(s)) {
    try {
      const v = Function(`"use strict";return (${s});`)();
      return typeof v === "number" && Number.isFinite(v) ? v : null;
    } catch {
      return null;
    }
  }
  return null;
}

export function checkNumeric(
  raw: string,
  answer: number,
  tol = 1e-3
): CheckResult {
  const v = parseNumeric(raw);
  if (v === null) return { correct: false };
  // Accept answers the student reasonably rounded: an absolute floor of 0.01
  // (covers 2-decimal rounding of irrational answers like 2pi/3 ≈ 2.09) plus a
  // relative allowance for large answers. (1e-6 was far tighter than the
  // 4-5 significant figures these prompts ask students to round to.)
  const eps = Math.max(0.01, tol * Math.abs(answer));
  return { correct: Math.abs(v - answer) <= eps };
}

export function checkChoice(chosen: Choice): CheckResult {
  if (chosen.correct) return { correct: true };
  return { correct: false, misconception: chosen.misconception };
}

export function checkAnswer(
  problem: Problem,
  payload: { raw?: string; choiceIndex?: number }
): CheckResult {
  if (problem.answerType === "numeric") {
    return checkNumeric(payload.raw ?? "", problem.numericAnswer ?? NaN);
  }
  const choices = problem.choices ?? [];
  const i = payload.choiceIndex ?? -1;
  if (i < 0 || i >= choices.length) return { correct: false };
  return checkChoice(choices[i]);
}
