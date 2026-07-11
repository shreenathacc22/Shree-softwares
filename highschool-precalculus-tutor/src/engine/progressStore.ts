// localStorage persistence + JSON export/import.

import type { Progress } from "../types";

const KEY = "precalc-tutor-progress-v1";

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Progress;
  } catch {
    /* ignore corrupt storage */
  }
  return {
    studentName: "",
    skills: {},
    unlockedUnits: ["unit-00"], // Foundations Gate is always open
    lastOpened: null,
    updatedAt: new Date().toISOString(),
  };
}

export function saveProgress(p: Progress): void {
  const now = new Date().toISOString();
  p.updatedAt = now;
  p.lastOpened = now;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage may be unavailable on some file:// configs */
  }
}

export function exportProgress(p: Progress): void {
  const blob = new Blob([JSON.stringify(p, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const stamp = new Date().toISOString().slice(0, 10);
  a.download = `precalc-progress-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importProgress(file: File): Promise<Progress> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const p = JSON.parse(String(reader.result)) as Progress;
        if (!p.skills || typeof p.skills !== "object") throw new Error("Invalid skills field");
        if (!Array.isArray(p.unlockedUnits)) throw new Error("Invalid unlockedUnits field");
        // Validate each skill has required fields
        for (const [, skill] of Object.entries(p.skills)) {
          const s = skill as any;
          if (typeof s.level !== "number" || typeof s.dueAt !== "number" ||
              typeof s.streak !== "number" || typeof s.mastered !== "boolean") {
            throw new Error("Corrupted skill data");
          }
        }
        resolve(p);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function resetProgress(): Progress {
  const fresh: Progress = {
    studentName: "",
    skills: {},
    unlockedUnits: ["unit-00"],
    lastOpened: null,
    updatedAt: new Date().toISOString(),
  };
  saveProgress(fresh);
  return fresh;
}
