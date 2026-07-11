import { useState } from "react";
import type { Skill, Example } from "../types";
import { MathText, MathInline } from "./MathText";

function ExampleCard({ ex }: { ex: Example }) {
  const [revealed, setRevealed] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const label =
    ex.type === "worked"
      ? "Worked example"
      : ex.type === "completion"
      ? "You finish it"
      : "Try it";

  return (
    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16, marginTop: 16 }}>
      <span className="example-tag">{label}</span>
      <div className="prose"><MathText text={ex.prompt} /></div>

      <ol className="steps">
        {ex.steps.slice(0, revealed).map((s, i) => (
          <li key={i}><MathText text={s} /></li>
        ))}
      </ol>

      <div className="row">
        {revealed < ex.steps.length && (
          <button className="btn sm" onClick={() => setRevealed((n) => n + 1)}>
            Reveal next step
          </button>
        )}
        {revealed < ex.steps.length && (
          <button className="btn sm ghost" onClick={() => setRevealed(ex.steps.length)}>
            Show all steps
          </button>
        )}
        {!showAnswer && (
          <button className="btn sm ghost" onClick={() => setShowAnswer(true)}>
            Show answer
          </button>
        )}
      </div>

      {showAnswer && (
        <div className="feedback good" style={{ marginTop: 12 }}>
          <b>Answer:&nbsp;</b><MathText text={ex.answer} />
        </div>
      )}

      {ex.selfExplain && (
        <div className="selfexplain">
          <b>Think it through:</b> <MathInline text={ex.selfExplain} />
        </div>
      )}
    </div>
  );
}

export function Lesson({ skill, onStartPractice }: { skill: Skill; onStartPractice: () => void }) {
  return (
    <div className="card">
      <h2>{skill.name}</h2>
      <p className="sub">Read the lesson, study the examples, then practice until it sticks.</p>
      <div className="prose"><MathText text={skill.lesson} /></div>

      {skill.examples.map((ex, i) => (
        <ExampleCard key={i} ex={ex} />
      ))}

      <div className="row" style={{ marginTop: 20 }}>
        <button className="btn primary" onClick={onStartPractice}>
          Start practice →
        </button>
      </div>
    </div>
  );
}
