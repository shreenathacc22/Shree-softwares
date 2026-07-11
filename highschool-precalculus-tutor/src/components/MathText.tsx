import katex from "katex";

function renderTex(tex: string, display: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      output: "html",
    });
  } catch {
    return display ? `$$${tex}$$` : `$${tex}$`;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Inline markdown: **bold**, then $...$ math. */
function renderInline(text: string): string {
  // Process markdown in order: first bold (before math), then math
  // Replace bold markers with a placeholder to survive math splitting
  const BOLD_MARKER = "@@BOLD@@";
  const boldParts: string[] = [];
  let boldCount = 0;
  let txt = text.replace(/\*\*([^*]+)\*\*/g, () => {
    boldParts.push(arguments[1]);
    return `${BOLD_MARKER}${boldCount++}${BOLD_MARKER}`;
  });

  // split on $...$ (inline math), keeping delimiters out
  const parts = txt.split(/(\$[^$]+\$)/g);
  return parts
    .map((p) => {
      if (p.startsWith("$") && p.endsWith("$") && p.length > 2) {
        return renderTex(p.slice(1, -1), false);
      }
      let s = escapeHtml(p);
      // Replace bold placeholders with strong tags
      s = s.replace(/@@BOLD@@(\d+)@@BOLD@@/g, (_, idx) => `<strong>${escapeHtml(boldParts[parseInt(idx)])}</strong>`);
      return s;
    })
    .join("");
}

/**
 * Render a block of markdown-lite text:
 * - $$...$$ display math (own line)
 * - paragraphs separated by blank lines
 * - "- " bullet lists
 * - **bold** and $inline$ math within lines
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  // First peel off display-math blocks
  const segments = text.split(/(\$\$[^$]+\$\$)/g);
  const html = segments
    .map((seg) => {
      if (seg.startsWith("$$") && seg.endsWith("$$") && seg.length > 4) {
        return renderTex(seg.slice(2, -2), true);
      }
      // ordinary text: split into paragraphs / lists by line
      const blocks = seg.split(/\n{2,}/);
      return blocks
        .map((block) => {
          const lines = block.split(/\n/).filter((l) => l.trim() !== "");
          if (lines.length === 0) return "";
          if (lines.every((l) => l.trim().startsWith("- "))) {
            const items = lines
              .map((l) => `<li>${renderInline(l.trim().slice(2))}</li>`)
              .join("");
            return `<ul>${items}</ul>`;
          }
          return `<p>${lines.map((l) => renderInline(l)).join("<br/>")}</p>`;
        })
        .join("");
    })
    .join("");

  return (
    <div
      className={className ? `prose ${className}` : "prose"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Inline-only variant for short labels (choices, prompts on one line). */
export function MathInline({ text }: { text: string }) {
  return <span dangerouslySetInnerHTML={{ __html: renderInline(text) }} />;
}
