import { useEffect, useMemo, useState } from "react";
import type { Progress, Skill, Unit } from "./types";
import { UNITS, findUnit } from "./content";
import {
  loadProgress,
  saveProgress,
  resetProgress,
} from "./engine/progressStore";
import {
  applyResult,
  freshProgress,
  buildReviewQueue,
  unitMastered,
  unmasteredSkills,
} from "./engine/scheduler";
import { Lesson } from "./components/Lesson";
import { PracticeEngine } from "./components/PracticeEngine";
import { ProgressPanel } from "./components/ProgressPanel";
import { MathText } from "./components/MathText";

type View =
  | { name: "home" }
  | { name: "unit"; unitId: string }
  | { name: "lesson"; skillId: string }
  | { name: "practice"; skillId: string }
  | { name: "review" }
  | { name: "mastery"; unitId: string }
  | { name: "progress" }
  | { name: "namePrompt" };

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [view, setView] = useState<View>({ name: "home" });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => saveProgress(progress), [progress]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  /** Record a practice result and unlock the next unit if a unit got mastered. */
  function recordResult(skillId: string, correct: boolean, now: number = Date.now()) {
    setProgress((prev) => {
      const skillMeta = UNITS.flatMap((u) => u.skills).find((s) => s.id === skillId);
      if (!skillMeta) return prev;
      const cur = prev.skills[skillId] ?? freshProgress(now);
      const updated = applyResult(cur, correct, skillMeta.mastery, now);
      const skills = { ...prev.skills, [skillId]: updated };

      // recompute unlocks: a unit unlocks once its prerequisite is fully mastered
      const unlocked = new Set(prev.unlockedUnits);
      let announce: string | null = null;
      for (const u of UNITS) {
        if (u.requires === null) unlocked.add(u.id);
        else {
          const prereq = findUnit(u.requires);
          if (prereq && prereq.skills.every((s) => skills[s.id]?.mastered)) {
            if (!unlocked.has(u.id)) announce = u.title;
            unlocked.add(u.id);
          }
        }
      }
      if (announce) setToast(`🎉 Unlocked: ${announce}`);
      return { ...prev, skills, unlockedUnits: [...unlocked] };
    });
  }

  function importProgress(p: Progress) {
    setProgress(p);
    setView({ name: "home" });
    setToast("Progress imported ✓");
  }
  function doReset() {
    setProgress(resetProgress());
    setView({ name: "home" });
    setToast("Progress reset");
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">∑</div>
        <div className="title">
          <h1>{progress.studentName || "Precalc"} Tutor</h1>
          <p>Foundations → Precalculus → a first taste of Calculus</p>
        </div>
        <div className="spacer" />
        {view.name !== "home" && (
          <button className="btn ghost sm" onClick={() => setView({ name: "home" })}>
            ⌂ Home
          </button>
        )}
        <button className="btn sm" onClick={() => setView({ name: "progress" })}>
          Progress
        </button>
      </header>

      {view.name === "home" && (
        <Home progress={progress} setProgress={setProgress} setView={setView} />
      )}
      {view.name === "unit" && findUnit(view.unitId) && (
        <UnitView
          unit={findUnit(view.unitId)!}
          progress={progress}
          setView={setView}
        />
      )}
      {view.name === "lesson" && (
        <LessonView skillId={view.skillId} setView={setView} />
      )}
      {view.name === "practice" && (
        <PracticeView
          skillId={view.skillId}
          progress={progress}
          onResult={recordResult}
          setView={setView}
        />
      )}
      {view.name === "review" && (
        <ReviewView progress={progress} onResult={recordResult} setView={setView} />
      )}
      {view.name === "mastery" && findUnit(view.unitId) && (
        <MasteryView
          unit={findUnit(view.unitId)!}
          progress={progress}
          setView={setView}
        />
      )}
      {view.name === "progress" && (
        <ProgressPanel
          progress={progress}
          onImport={importProgress}
          onReset={doReset}
          onClose={() => setView({ name: "home" })}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ---------------- Home ----------------
function Home({
  progress,
  setProgress,
  setView,
}: {
  progress: Progress;
  setProgress: (p: Progress) => void;
  setView: (v: View) => void;
}) {
  const now = Date.now();
  const dueCount = useMemo(
    () => buildReviewQueue(UNITS, progress.unlockedUnits, progress.skills, now).length,
    [progress, now]
  );

  return (
    <>
      <div className="hero">
        <h2>Welcome back{progress.studentName ? `, ${progress.studentName}` : ""}! 👋</h2>
        <p>
          Work through each unit one skill at a time. Master every skill to unlock
          the next unit — all the way to your first real calculus.
        </p>
        {!progress.studentName && (
          <div className="row" style={{ marginTop: 12 }}>
            <button
              className="btn ghost sm"
              onClick={() => {
                const name = prompt("What's your name?");
                if (name?.trim()) {
                  setProgress({ ...progress, studentName: name.trim() });
                }
              }}
            >
              Set your name
            </button>
          </div>
        )}
      </div>

      {dueCount > 0 && (
        <div className="card" style={{ borderColor: "var(--accent)" }}>
          <div className="row">
            <div>
              <h2>🔁 Mixed Review ready</h2>
              <p className="sub">
                {dueCount} skill{dueCount > 1 ? "s" : ""} due. Reviewing old skills
                mixed with new ones is what makes them stick.
              </p>
            </div>
            <button className="btn primary right" onClick={() => setView({ name: "review" })}>
              Start review
            </button>
          </div>
        </div>
      )}

      {UNITS.map((unit, i) => {
        const unlocked = progress.unlockedUnits.includes(unit.id);
        const done = unitMastered(unit, progress.skills);
        const masteredCount = unit.skills.filter((s) => progress.skills[s.id]?.mastered).length;
        const pct = Math.round((masteredCount / unit.skills.length) * 100);
        const cls = `unit ${unlocked ? "open" : "locked"} ${done ? "mastered" : ""}`;
        return (
          <div
            key={unit.id}
            className={cls}
            onClick={() => unlocked && setView({ name: "unit", unitId: unit.id })}
          >
            <div className="badge">{done ? "✓" : unlocked ? i : "🔒"}</div>
            <div className="meta">
              <h3>{unit.title}</h3>
              <p>{unit.blurb}</p>
              {unlocked && (
                <div className="bar"><span style={{ width: `${pct}%` }} /></div>
              )}
            </div>
            <div className={`status ${done ? "done" : unlocked ? "progress" : "locked"}`}>
              {done ? "Mastered" : unlocked ? `${masteredCount}/${unit.skills.length}` : "Locked"}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ---------------- Unit view (skill list) ----------------
function UnitView({
  unit,
  progress,
  setView,
}: {
  unit: Unit;
  progress: Progress;
  setView: (v: View) => void;
}) {
  const allMastered = unitMastered(unit, progress.skills);
  return (
    <>
      <button className="backlink" onClick={() => setView({ name: "home" })}>← All units</button>
      <div className="card" style={{ marginTop: 10 }}>
        <h2>{unit.title}</h2>
        <p className="sub">{unit.blurb}</p>
        <div className="skill-nav">
          {unit.skills.map((s) => {
            const sp = progress.skills[s.id];
            const done = sp?.mastered;
            return (
              <button
                key={s.id}
                className={`skill-row ${done ? "done" : ""}`}
                onClick={() => setView({ name: "lesson", skillId: s.id })}
              >
                <span className="mk">{done ? "✓" : "•"}</span>
                <span className="nm">{s.name}</span>
                <span className="lv">{sp ? `level ${sp.level}` : "new"}</span>
              </button>
            );
          })}
        </div>
        <div className="row" style={{ marginTop: 18 }}>
          <button
            className="btn primary"
            onClick={() => setView({ name: "mastery", unitId: unit.id })}
          >
            {allMastered ? "✓ Mastery Check" : "Take Mastery Check"}
          </button>
        </div>
      </div>
    </>
  );
}

// ---------------- Lesson view ----------------
function LessonView({ skillId, setView }: { skillId: string; setView: (v: View) => void }) {
  const found = UNITS.flatMap((u) => u.skills.map((s) => ({ s, u }))).find(
    (x) => x.s.id === skillId
  )!;
  return (
    <>
      <button className="backlink" onClick={() => setView({ name: "unit", unitId: found.u.id })}>
        ← {found.u.title}
      </button>
      <div style={{ marginTop: 10 }}>
        <Lesson
          skill={found.s}
          onStartPractice={() => setView({ name: "practice", skillId })}
        />
      </div>
    </>
  );
}

// ---------------- Practice view ----------------
function PracticeView({
  skillId,
  progress,
  onResult,
  setView,
}: {
  skillId: string;
  progress: Progress;
  onResult: (id: string, c: boolean) => void;
  setView: (v: View) => void;
}) {
  const found = UNITS.flatMap((u) => u.skills.map((s) => ({ s, u }))).find(
    (x) => x.s.id === skillId
  )!;
  const sp = progress.skills[skillId];
  return (
    <>
      <button className="backlink" onClick={() => setView({ name: "unit", unitId: found.u.id })}>
        ← {found.u.title}
      </button>
      <div className="card" style={{ marginTop: 10 }}>
        <h2>{found.s.name}</h2>
        <p className="sub">Practice · {found.u.title}</p>
        <PracticeEngine skill={found.s} progress={sp} onResult={onResult} />
        {sp?.mastered && (
          <div className="feedback good" style={{ marginTop: 16 }}>
            🎉 You've mastered this skill! It will resurface later in Mixed Review
            so it stays sharp. <button className="backlink" onClick={() => setView({ name: "unit", unitId: found.u.id })}>Back to unit</button>
          </div>
        )}
      </div>
    </>
  );
}

// ---------------- Mixed Review view ----------------
function ReviewView({
  progress,
  onResult,
  setView,
}: {
  progress: Progress;
  onResult: (id: string, c: boolean) => void;
  setView: (v: View) => void;
}) {
  // snapshot the queue once on entry
  const [queue] = useState<Skill[]>(() =>
    buildReviewQueue(UNITS, progress.unlockedUnits, progress.skills, Date.now())
  );
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(false);

  if (queue.length === 0) {
    return (
      <div className="card center">
        <div className="big-emoji">✨</div>
        <h2>Nothing due right now</h2>
        <p className="muted">Great job — come back later and older skills will resurface.</p>
        <button className="btn primary" onClick={() => setView({ name: "home" })}>Back home</button>
      </div>
    );
  }

  if (idx >= queue.length) {
    return (
      <div className="card center">
        <div className="big-emoji">🏅</div>
        <h2>Review complete!</h2>
        <p className="muted">You refreshed {queue.length} due skill{queue.length > 1 ? "s" : ""}.</p>
        <button className="btn primary" onClick={() => setView({ name: "home" })}>Back home</button>
      </div>
    );
  }

  const skill = queue[idx];
  return (
    <>
      <button className="backlink" onClick={() => setView({ name: "home" })}>← Home</button>
      <div className="card" style={{ marginTop: 10 }}>
        <div className="row">
          <h2>Mixed Review</h2>
          <span className="muted right">{idx + 1} / {queue.length}</span>
        </div>
        <PracticeEngine
          key={`${skill.id}-${idx}`}
          skill={skill}
          progress={progress.skills[skill.id]}
          context={skill.name}
          onResult={(id, c) => {
            onResult(id, c);
            setAnswered(true);
          }}
        />
        {answered && (
          <div className="row" style={{ marginTop: 14 }}>
            <button
              className="btn"
              onClick={() => {
                setAnswered(false);
                setIdx((n) => n + 1);
              }}
            >
              {idx + 1 < queue.length ? "Next review skill →" : "Finish review"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ---------------- Mastery Check view ----------------
function MasteryView({
  unit,
  progress,
  setView,
}: {
  unit: Unit;
  progress: Progress;
  setView: (v: View) => void;
}) {
  const passed = unitMastered(unit, progress.skills);
  const remaining = unmasteredSkills(unit, progress.skills);
  const nextUnit = UNITS.find((u) => u.requires === unit.id);

  return (
    <>
      <button className="backlink" onClick={() => setView({ name: "unit", unitId: unit.id })}>
        ← {unit.title}
      </button>
      <div className="card center" style={{ marginTop: 10 }}>
        {passed ? (
          <>
            <div className="big-emoji">🏆</div>
            <h2>Mastery Check passed!</h2>
            <p className="muted">
              Every skill in {unit.title} is mastered.
              {nextUnit ? ` ${nextUnit.title} is unlocked.` : " You've reached the end — incredible work!"}
            </p>
            <div className="row" style={{ justifyContent: "center", marginTop: 12 }}>
              {nextUnit && progress.unlockedUnits.includes(nextUnit.id) && (
                <button className="btn primary" onClick={() => setView({ name: "unit", unitId: nextUnit.id })}>
                  Go to {nextUnit.title} →
                </button>
              )}
              <button className="btn" onClick={() => setView({ name: "home" })}>Home</button>
            </div>
          </>
        ) : (
          <>
            <div className="big-emoji">🎯</div>
            <h2>Almost there</h2>
            <p className="muted">
              The Mastery Check passes only when <b>every</b> skill is mastered.
              Keep practicing these:
            </p>
            <div className="skill-nav" style={{ textAlign: "left", marginTop: 14 }}>
              {remaining.map((s) => {
                const sp = progress.skills[s.id];
                const need = s.mastery.requiredStreak;
                const have = Math.min(sp?.streak ?? 0, need);
                return (
                  <button
                    key={s.id}
                    className="skill-row"
                    onClick={() => setView({ name: "practice", skillId: s.id })}
                  >
                    <span className="mk">→</span>
                    <span className="nm">
                      <MathText text={s.name} />
                    </span>
                    <span className="lv">{have}/{need} streak</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
