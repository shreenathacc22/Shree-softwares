import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-03",
  title: "Trigonometric Functions",
  blurb:
    "Radian measure, the unit circle, and the trigonometric identities — the language and algebra of periodic behavior.",
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
    {
      id: "u03-s03",
      name: "Reciprocal and quotient identities",
      lesson:
        "Three of the six trig functions are just reciprocals of the others, and tangent is a quotient:\n\n$$\\sec\\theta = \\frac{1}{\\cos\\theta}, \\qquad \\csc\\theta = \\frac{1}{\\sin\\theta}, \\qquad \\cot\\theta = \\frac{1}{\\tan\\theta},$$\n\n$$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}, \\qquad \\cot\\theta = \\frac{\\cos\\theta}{\\sin\\theta}.$$\n\nAny trig expression can be rewritten using only sine and cosine — that's usually the first move when simplifying.",
      examples: [
        {
          type: "worked",
          prompt: "Simplify $\\sec\\theta \\cdot \\cot\\theta$.",
          steps: [
            "Rewrite in sine and cosine: $\\dfrac{1}{\\cos\\theta}\\cdot\\dfrac{\\cos\\theta}{\\sin\\theta}$.",
            "Cancel $\\cos\\theta$: $\\dfrac{1}{\\sin\\theta}$.",
            "Recognize the reciprocal: $\\csc\\theta$.",
          ],
          answer: "$\\csc\\theta$",
          selfExplain: "Why does rewriting everything in sine and cosine make simplifying easier?",
        },
      ],
      generator: "reciprocalQuotientIdentity",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u03-s04",
      name: "Pythagorean identities",
      lesson:
        "Because $(\\cos\\theta, \\sin\\theta)$ sits on the unit circle $x^2 + y^2 = 1$:\n\n$$\\sin^2\\theta + \\cos^2\\theta = 1.$$\n\nDividing through by $\\cos^2\\theta$ or $\\sin^2\\theta$ gives the two companions:\n\n$$1 + \\tan^2\\theta = \\sec^2\\theta, \\qquad 1 + \\cot^2\\theta = \\csc^2\\theta.$$\n\nGiven one trig value and the quadrant, these let you find all the others. **The quadrant decides the sign.**",
      examples: [
        {
          type: "worked",
          prompt: "If $\\sin\\theta = \\dfrac{3}{5}$ and $\\theta$ is in Quadrant II, find $\\cos\\theta$.",
          steps: [
            "$\\cos^2\\theta = 1 - \\sin^2\\theta = 1 - \\dfrac{9}{25} = \\dfrac{16}{25}$.",
            "So $\\cos\\theta = \\pm\\dfrac{4}{5}$.",
            "In Quadrant II cosine is negative: $\\cos\\theta = -\\dfrac{4}{5}$.",
          ],
          answer: "$-\\dfrac{4}{5}$",
          selfExplain: "Why does the Pythagorean identity come straight from the unit circle equation?",
        },
      ],
      generator: "pythagoreanIdentity",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u03-s05",
      name: "Even/odd and cofunction identities",
      lesson:
        "**Even/odd (negative-angle) identities.** Cosine is even; sine and tangent are odd:\n\n$$\\cos(-\\theta) = \\cos\\theta, \\qquad \\sin(-\\theta) = -\\sin\\theta, \\qquad \\tan(-\\theta) = -\\tan\\theta.$$\n\n**Cofunction identities.** Each function equals its co-function of the complement:\n\n$$\\sin\\left(\\tfrac{\\pi}{2} - \\theta\\right) = \\cos\\theta, \\qquad \\cos\\left(\\tfrac{\\pi}{2} - \\theta\\right) = \\sin\\theta, \\qquad \\tan\\left(\\tfrac{\\pi}{2} - \\theta\\right) = \\cot\\theta.$$\n\nOn the unit circle: reflecting over the x-axis flips $y$ (sine) but not $x$ (cosine).",
      examples: [
        {
          type: "worked",
          prompt: "Simplify $\\sin(-\\theta)\\,\\cos(-\\theta)$.",
          steps: [
            "$\\sin(-\\theta) = -\\sin\\theta$ (sine is odd).",
            "$\\cos(-\\theta) = \\cos\\theta$ (cosine is even).",
            "Product: $-\\sin\\theta\\cos\\theta$.",
          ],
          answer: "$-\\sin\\theta\\cos\\theta$",
          selfExplain: "Using the unit circle, why does negating the angle flip sine but not cosine?",
        },
      ],
      generator: "evenOddCofunction",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u03-s06",
      name: "Sum and difference formulas",
      lesson:
        "Exact values for angles like $75^\\circ$ or $15^\\circ$ come from combining known angles:\n\n$$\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B$$\n\n$$\\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B$$\n\n$$\\tan(A \\pm B) = \\frac{\\tan A \\pm \\tan B}{1 \\mp \\tan A\\tan B}$$\n\n**Watch the signs:** for cosine the sign in the middle *flips*.",
      examples: [
        {
          type: "worked",
          prompt: "Find the exact value of $\\cos(75^\\circ)$.",
          steps: [
            "Write $75^\\circ = 45^\\circ + 30^\\circ$.",
            "$\\cos(45^\\circ + 30^\\circ) = \\cos 45^\\circ\\cos 30^\\circ - \\sin 45^\\circ\\sin 30^\\circ$.",
            "$= \\dfrac{\\sqrt{2}}{2}\\cdot\\dfrac{\\sqrt{3}}{2} - \\dfrac{\\sqrt{2}}{2}\\cdot\\dfrac{1}{2} = \\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$.",
          ],
          answer: "$\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$",
          selfExplain: "Why does $\\cos(A+B)$ use a minus sign while $\\sin(A+B)$ uses a plus?",
        },
      ],
      generator: "sumDifferenceFormula",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u03-s07",
      name: "Double-angle formulas",
      lesson:
        "Set $A = B = \\theta$ in the sum formulas to get:\n\n$$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$$\n\n$$\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta$$\n\n$$\\tan 2\\theta = \\frac{2\\tan\\theta}{1 - \\tan^2\\theta}$$\n\nThe three forms of $\\cos 2\\theta$ are all equivalent via $\\sin^2\\theta + \\cos^2\\theta = 1$ — pick whichever matches what you know.",
      examples: [
        {
          type: "worked",
          prompt: "If $\\sin\\theta = \\dfrac{3}{5}$ and $\\theta$ is in Quadrant I, find $\\sin 2\\theta$.",
          steps: [
            "Quadrant I, so $\\cos\\theta = \\sqrt{1 - \\tfrac{9}{25}} = \\dfrac{4}{5}$.",
            "$\\sin 2\\theta = 2\\sin\\theta\\cos\\theta = 2\\cdot\\dfrac{3}{5}\\cdot\\dfrac{4}{5}$.",
            "$= \\dfrac{24}{25}$.",
          ],
          answer: "$\\dfrac{24}{25}$",
          selfExplain: "How is $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$ a special case of $\\sin(A+B)$?",
        },
      ],
      generator: "doubleAngleFormula",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u03-s08",
      name: "Half-angle formulas",
      lesson:
        "Solving the $\\cos 2\\theta$ forms for the squared terms and replacing $\\theta$ with $\\tfrac{\\theta}{2}$:\n\n$$\\sin\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1 - \\cos\\theta}{2}}, \\qquad \\cos\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1 + \\cos\\theta}{2}}$$\n\n$$\\tan\\frac{\\theta}{2} = \\frac{1 - \\cos\\theta}{\\sin\\theta} = \\frac{\\sin\\theta}{1 + \\cos\\theta}$$\n\nThe $\\pm$ is **not automatic** — choose the sign from the quadrant where $\\tfrac{\\theta}{2}$ lands.",
      examples: [
        {
          type: "worked",
          prompt: "Find the exact value of $\\cos(15^\\circ)$ using a half-angle formula.",
          steps: [
            "$15^\\circ = \\tfrac{30^\\circ}{2}$, and $15^\\circ$ is in Quadrant I so cosine is positive.",
            "$\\cos 15^\\circ = \\sqrt{\\dfrac{1 + \\cos 30^\\circ}{2}} = \\sqrt{\\dfrac{1 + \\tfrac{\\sqrt{3}}{2}}{2}}$.",
            "$= \\sqrt{\\dfrac{2 + \\sqrt{3}}{4}} = \\dfrac{\\sqrt{2 + \\sqrt{3}}}{2}$.",
          ],
          answer: "$\\dfrac{\\sqrt{2+\\sqrt{3}}}{2}$",
          selfExplain: "Why must you check the quadrant of $\\theta/2$ (not $\\theta$) to pick the sign?",
        },
      ],
      generator: "halfAngleFormula",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u03-s09",
      name: "Verifying identities and solving trig equations",
      lesson:
        "**Verifying an identity** means transforming one side into the other using known identities. Strategy:\n\n1. Start with the more complicated side.\n2. Rewrite everything in sine and cosine.\n3. Combine fractions, factor, and use the Pythagorean identities.\n4. **Never** move terms across the equals sign — that assumes what you're proving.\n\n**Solving trig equations** uses the same identities to reduce to a basic equation like $\\sin\\theta = \\tfrac{1}{2}$, then reads all solutions on $[0, 2\\pi)$ from the unit circle.",
      examples: [
        {
          type: "worked",
          prompt: "Solve $2\\sin^2\\theta - \\sin\\theta - 1 = 0$ on $[0, 2\\pi)$.",
          steps: [
            "Factor like a quadratic in $\\sin\\theta$: $(2\\sin\\theta + 1)(\\sin\\theta - 1) = 0$.",
            "$\\sin\\theta = -\\tfrac{1}{2}$ or $\\sin\\theta = 1$.",
            "$\\sin\\theta = -\\tfrac{1}{2}$: $\\theta = \\tfrac{7\\pi}{6}, \\tfrac{11\\pi}{6}$. $\\quad\\sin\\theta = 1$: $\\theta = \\tfrac{\\pi}{2}$.",
          ],
          answer: "$\\theta = \\dfrac{\\pi}{2},\\ \\dfrac{7\\pi}{6},\\ \\dfrac{11\\pi}{6}$",
          selfExplain: "Why can't you divide both sides of a trig equation by $\\sin\\theta$?",
        },
      ],
      generator: "verifySolveIdentity",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
  ],
};

export default unit;
