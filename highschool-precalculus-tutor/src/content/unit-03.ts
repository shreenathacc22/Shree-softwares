import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-03",
  title: "Trigonometric Functions",
  blurb: "Radian measure and the unit circle — the language of periodic behavior.",
  mcpsStandards: ["MCPS Precalc Unit 3", "MD CCR: Trigonometric Functions"],
  requires: "unit-02",
  skills: [
    {
      id: "u03-s01",
      name: "Degrees and radians",
      lesson:
        "Radians measure angles by arc length on a unit circle. A full circle is $2\\pi$ radians $= 360^\\circ$, so:\n\n$$\\text{radians} = \\text{degrees}\\times\\frac{\\pi}{180}.$$\n\nCalculus uses radians almost exclusively, so get comfortable converting.",
      examples: [
        {
          type: "worked",
          prompt: "Convert $90^\\circ$ to radians.",
          steps: ["Multiply by $\\pi/180$.", "$90\\cdot\\frac{\\pi}{180} = \\frac{\\pi}{2}$."],
          answer: "$\\frac{\\pi}{2}$",
          selfExplain: "Why is $180^\\circ$ exactly $\\pi$ radians?",
        },
      ],
      generator: "degToRad",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u03-s02",
      name: "Unit circle values",
      lesson:
        "On the unit circle, the point at angle $\\theta$ has coordinates $(\\cos\\theta, \\sin\\theta)$. So **cosine is the x-coordinate** and **sine is the y-coordinate**. Memorizing a few key angles ($0, \\frac{\\pi}{6}, \\frac{\\pi}{4}, \\frac{\\pi}{3}, \\frac{\\pi}{2}$) unlocks most problems.",
      examples: [
        {
          type: "worked",
          prompt: "Find $\\cos(\\pi)$.",
          steps: ["At angle $\\pi$ the point is $(-1, 0)$.", "Cosine is the x-coordinate: $-1$."],
          answer: "$\\cos(\\pi) = -1$",
        },
      ],
      generator: "unitCircleValue",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
  ],
};

export default unit;
