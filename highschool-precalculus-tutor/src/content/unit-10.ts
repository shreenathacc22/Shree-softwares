import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-10",
  title: "Applications of Derivatives",
  blurb: "Use the derivative to analyze curves: rising/falling, peaks, valleys, and bends.",
  mcpsStandards: ["AP Calculus AB Unit 5", "Analytical Applications of Differentiation"],
  requires: "unit-09",
  skills: [
    {
      id: "u10-s01",
      name: "Increasing & decreasing intervals",
      lesson:
        "The derivative is the slope, so its **sign** tells you which way a function is heading:\n\n- $f'(x) > 0$ → $f$ is **increasing** (going up)\n- $f'(x) < 0$ → $f$ is **decreasing** (going down)\n\nTo find the intervals, compute $f'(x)$, find where it equals zero, and test the sign on each side.",
      examples: [
        {
          type: "worked",
          prompt: "On what interval is $f(x) = x^2 - 4x$ increasing?",
          steps: [
            "$f'(x) = 2x - 4$.",
            "Set $f'(x) = 0$: $2x - 4 = 0 \\Rightarrow x = 2$.",
            "For $x > 2$, $f'(x) > 0$ → increasing.",
          ],
          answer: "$x > 2$",
          selfExplain: "Why does the sign of the slope tell you whether the graph rises or falls?",
        },
      ],
      generator: "increasingInterval",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u10-s02",
      name: "Critical points",
      lesson:
        "A **critical point** is where the slope is zero (a possible peak, valley, or flat spot): solve $f'(x) = 0$. These are the only places a smooth function can turn around, so they're the first thing to find when analyzing a graph.",
      examples: [
        {
          type: "worked",
          prompt: "Find the critical point of $f(x) = x^2 + 6x + 1$.",
          steps: [
            "$f'(x) = 2x + 6$.",
            "Set to zero: $2x + 6 = 0$.",
            "Solve: $x = -3$.",
          ],
          answer: "$x = -3$",
        },
      ],
      generator: "criticalPointQuad",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u10-s03",
      name: "Local maxima & minima",
      lesson:
        "Once you have a critical point, decide whether it's a **peak (max)** or a **valley (min)**. For a parabola the leading coefficient settles it:\n\n- $x^2$ coefficient **positive** → opens up → the vertex is a **minimum**.\n- $x^2$ coefficient **negative** → opens down → the vertex is a **maximum**.\n\n(More generally, this is the *first-derivative test*: $f'$ changing $+\\to-$ is a max, $-\\to+$ is a min.)",
      examples: [
        {
          type: "worked",
          prompt: "Does $f(x) = -2x^2 + 4x + 1$ have a local max or min?",
          steps: [
            "The $x^2$ coefficient is $-2$ (negative).",
            "Negative → the parabola opens downward.",
            "An opening-down parabola has a peak → a local maximum.",
          ],
          answer: "A local maximum.",
          selfExplain: "How could the sign of $f'$ on each side of the critical point confirm this?",
        },
      ],
      generator: "maxOrMin",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u10-s04",
      name: "Concavity & inflection points",
      lesson:
        "The **second derivative** $f''(x)$ measures how the curve bends:\n\n- $f''(x) > 0$ → **concave up** (shaped like a cup ∪)\n- $f''(x) < 0$ → **concave down** (shaped like a cap ∩)\n\nWhere concavity switches is an **inflection point**. The second derivative also gives a quick max/min test: at a critical point, $f'' > 0$ means a min, $f'' < 0$ means a max.",
      examples: [
        {
          type: "worked",
          prompt: "Where is $f(x) = x^3$ concave up?",
          steps: [
            "$f'(x) = 3x^2$, then $f''(x) = 6x$.",
            "Concave up where $f''(x) > 0$: $6x > 0$.",
            "So $x > 0$ (inflection point at $x = 0$).",
          ],
          answer: "$x > 0$",
        },
      ],
      generator: "concavityCubic",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u10-s05",
      name: "Optimization",
      lesson:
        "**Optimization** uses derivatives to find the *best* value — the largest area, the cheapest cost, the shortest distance. The recipe: write the quantity as a function of one variable, take its derivative, set it to zero, and solve. Among rectangles with a fixed perimeter, the **square** has the greatest area — and calculus proves it.",
      examples: [
        {
          type: "worked",
          prompt: "A rectangle has perimeter 20. What width gives the largest area?",
          steps: [
            "Length $= 10 - w$, so area $A(w) = w(10 - w) = 10w - w^2$.",
            "$A'(w) = 10 - 2w$.",
            "Set $A'(w) = 0$: $10 - 2w = 0 \\Rightarrow w = 5$ (a square).",
          ],
          answer: "width $= 5$",
          selfExplain: "Why does setting the derivative to zero locate the maximum area?",
        },
      ],
      generator: "optimizeRectangle",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
  ],
};

export default unit;
