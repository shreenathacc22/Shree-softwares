// Spaced-repetition scheduler: Leitner boxes with SM-2-style ease.
// No external dependency.

import type { SkillProgress, Skill, Unit } from "../types";

export const MAX_LEVEL = 6;

// Interval per level, in milliseconds. Index = level.
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
export const BASE_INTERVALS = [
  10 * MIN, // 0
  1 * HOUR, // 1
  1 * DAY, // 2
  3 * DAY, // 3
  7 * DAY, // 4
  16 * DAY, // 5
  35 * DAY, // 6
];
const SHORT_RELEARN_INTERVAL = 10 * MIN;

export function freshProgress(now: number): SkillProgress {
  return {
    level: 0,
    dueAt: now,
    streak: 0,
    attempts: 0,
    correct: 0,
    mastered: false,
  };
}

/** Update a skill's progress after an answer. Returns a new object. */
export function applyResult(
  prev: SkillProgress,
  correct: boolean,
  rule: { requiredStreak: number; minLevel: number },
  now: number
): SkillProgress {
  const s: SkillProgress = { ...prev };
  s.attempts += 1;
  if (correct) {
    s.correct += 1;
    s.streak += 1;
    s.level = Math.min(s.level + 1, MAX_LEVEL);
    s.dueAt = now + BASE_INTERVALS[s.level];
    s.mastered = s.level >= rule.minLevel && s.streak >= rule.requiredStreak;
  } else {
    s.streak = 0;
    s.level = Math.max(s.level - 2, 0);
    s.dueAt = now + SHORT_RELEARN_INTERVAL;
    s.mastered = false;
  }
  return s;
}

/**
 * Build the mixed-review queue: all skills from unlocked units that are due,
 * ordered by dueAt ascending, then interleaved so the same skill is not
 * served three times back-to-back.
 */
export function buildReviewQueue(
  units: Unit[],
  unlockedUnits: string[],
  progress: Record<string, SkillProgress>,
  now: number
): Skill[] {
  const due: { skill: Skill; dueAt: number }[] = [];
  for (const unit of units) {
    if (!unlockedUnits.includes(unit.id)) continue;
    for (const skill of unit.skills) {
      const p = progress[skill.id];
      if (p && p.dueAt <= now && p.attempts > 0) {
        due.push({ skill, dueAt: p.dueAt });
      }
    }
  }
  due.sort((a, b) => a.dueAt - b.dueAt);
  return interleave(due.map((d) => d.skill));
}

/** Avoid the same skill id appearing three times in a row. */
function interleave(skills: Skill[]): Skill[] {
  const seen = new Set<string>();
  const out: Skill[] = [];
  for (const s of skills) {
    if (seen.has(s.id)) continue; // Already processed this skill ID
    const n = out.length;
    if (n >= 2 && out[n - 1].id === s.id && out[n - 2].id === s.id) {
      // Try to swap with a later different skill
      const later = skills.find((x) => !seen.has(x.id) && x.id !== s.id);
      if (later) {
        out.push(later);
        seen.add(later.id);
      }
    }
    out.push(s);
    seen.add(s.id);
  }
  return out;
}

/** A unit's mastery check passes only when every skill is mastered. */
export function unitMastered(
  unit: Unit,
  progress: Record<string, SkillProgress>
): boolean {
  return unit.skills.every((sk) => progress[sk.id]?.mastered);
}

/** Skills in a unit that are NOT yet mastered (for targeted remediation). */
export function unmasteredSkills(
  unit: Unit,
  progress: Record<string, SkillProgress>
): Skill[] {
  return unit.skills.filter((sk) => !progress[sk.id]?.mastered);
}
