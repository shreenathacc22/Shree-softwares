import { useState, useEffect, useCallback } from "react";
import type { Skill, Problem, SkillProgress } from "../types";
import { generate } from "../engine/generators";
import { checkAnswer } from "../engine/answerCheck";
import { MathText, MathInline } from "./MathText";

interface Props {
  skill: Skill;
  progress?: SkillProgress;
  onResult: (skillId: string, correct: boolean) => void;
  /** Optional banner, e.g. "Mixed Review" or "Mastery Check". */
  context?: string;
}

export function PracticeEngine({ skill, progress, onResult, context }: Props) {
  const [problem, setProblem] = useState<Problem>(() => generate(skill.generator));
  const [choiceIdx, setChoiceIdx] = useState<number | null>(null);
  const [raw, setRaw] = useState("");
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; misconception?: string } | null>(null);
  const [hintsShown, setHintsShown] = useState(0);

  const reset = useCallback(() => {
    setProblem(generate(skill.generator));
    setChoiceIdx(null);
    setRaw("");
    setChecked(false);
    setResult(null);
    setHintsShown(0);
  }, [skill.generator]);

  // regenerate when the skill itself changes (e.g. next item in review queue)
  useEffect(() => {
    reset();
  }, [skill.id, reset]);

  function submit() {
    if (checked) return;
    const r = checkAnswer(problem, {
      raw,
      choiceIndex: choiceIdx ?? -1,
    });
    setResult(r);
    setChecked(true);
    onResult(skill.id, r.correct);
  }

  const isMC = problem.answerType === "multiple-choice";
  const canSubmit = isMC ? choiceIdx !== null : raw.trim() !== "";
  const streak = progress?.streak ?? 0;
  const req = skill.mastery.requiredStreak;

  return (
    <div>
      {context && <div className="progress-pill"><b>{context}</b></div>}
      <div className="row" style={{ marginBottom: 6 }}>
        <span className="muted">
          Streak toward mastery:&nbsp;
          <span className="dots">
            {Array.from({ length: req }).map((_, i) => (
              <span key={i} className={`dot ${i < Math.min(streak, req) ? "on" : ""}`} />
            ))}
          </span>
        </span>
        {progress?.mastered && <span className="status done right">✓ Mastered</span>}
      </div>

      <div className="qbox">
        <MathText text={problem.prompt} />
      </div>

      {isMC ? (
        <div className="choices">
          {problem.choices!.map((c, i) => {
            let cls = "choice";
            if (checked) {
              if (c.correct) cls += " correct";
              else if (i === choiceIdx) cls += " wrong";
            } else if (i === choiceIdx) {
              cls += " wrong"; // selected highlight reuse
            }
            return (
              <button
                key={i}
                className={i === choiceIdx && !checked ? "choice" : cls}
                style={i === choiceIdx && !checked ? { borderColor: "var(--brand)", background: "var(--brand-l)" } : undefined}
                disabled={checked}
                onClick={() => setChoiceIdx(i)}
              >
                <MathInline text={c.label} />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="numrow">
          <input
            type="text"
            value={raw}
            placeholder="Your answer"
            disabled={checked}
            onChange={(e) => setRaw(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit && !checked) submit();
            }}
          />
          <span className="muted">decimals or fractions ok</span>
        </div>
      )}

      {!checked && (
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn primary" disabled={!canSubmit} onClick={submit}>
            Check answer
          </button>
          {hintsShown < problem.hints.length && (
            <button
              className="btn ghost"
              onClick={() => setHintsShown((n) => n + 1)}
            >
              💡 Hint ({problem.hints.length - hintsShown} left)
            </button>
          )}
        </div>
      )}

      {hintsShown > 0 && !checked && (
        <div className="hintbox">
          {problem.hints.slice(0, hintsShown).map((h, i) => (
            <div key={i}>
              <b>Hint {i + 1}:</b> <MathInline text={h} />
            </div>
          ))}
        </div>
      )}

      {checked && result && (
        <div className={`feedback ${result.correct ? "good" : "bad"}`}>
          <h4>{result.correct ? "✓ Correct!" : "Not quite."}</h4>
          {!result.correct && result.misconception && (
            <p className="mis">⚠ <MathInline text={result.misconception} /></p>
          )}
          {!result.correct && !result.misconception && (
            <p>
              The correct answer is <b><MathInline text={problem.answerDisplay ?? String(problem.numericAnswer)} /></b>.
            </p>
          )}
          <div><MathText text={problem.explanation} /></div>
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn primary" onClick={reset}>Next problem →</button>
          </div>
        </div>
      )}
    </div>
  );
}
