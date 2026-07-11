import { useRef } from "react";
import type { Progress } from "../types";
import { exportProgress, importProgress } from "../engine/progressStore";

interface Props {
  progress: Progress;
  onImport: (p: Progress) => void;
  onReset: () => void;
  onClose: () => void;
}

export function ProgressPanel({ progress, onImport, onReset, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const totalSkills = Object.keys(progress.skills).length;
  const mastered = Object.values(progress.skills).filter((s) => s.mastered).length;

  return (
    <div className="card">
      <div className="row">
        <h2>Progress</h2>
        <button className="btn ghost right" onClick={onClose}>Close</button>
      </div>
      <p className="sub">
        {mastered} of {totalSkills} practiced skills mastered ·
        units unlocked: {progress.unlockedUnits.length}
      </p>

      <div className="prose" style={{ fontSize: 14 }}>
        <p>
          Your progress saves automatically in this browser. To move to another
          computer or keep a backup, <strong>export</strong> a file and{" "}
          <strong>import</strong> it there.
        </p>
      </div>

      <div className="row" style={{ marginTop: 8 }}>
        <button className="btn primary" onClick={() => exportProgress(progress)}>
          ⬇ Export progress
        </button>
        <button className="btn" onClick={() => fileRef.current?.click()}>
          ⬆ Import progress
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try {
              const p = await importProgress(f);
              onImport(p);
            } catch {
              alert("That file could not be read as a progress file.");
            }
            e.target.value = "";
          }}
        />
        <button
          className="btn ghost right"
          onClick={() => {
            if (confirm("Reset ALL progress? This cannot be undone.")) onReset();
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
