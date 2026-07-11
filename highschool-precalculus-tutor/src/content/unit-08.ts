import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-08",
  title: "Calculus Intro (Capstone)",
  blurb: "Limits, the derivative as slope, and the power rule — your first taste of calculus.",
  mcpsStandards: ["Bridge to AP Calculus AB", "MD CCR: Limits & Rates of Change"],
  requires: "unit-07",
  skills: [
    {
      id: "u08-s01",
      name: "Limits by direct substitution",
      lesson:
        "A **limit** $\\lim_{x\\to a} f(x)$ asks what value $f(x)$ approaches as $x$ gets close to $a$. For functions that are *continuous* (like polynomials), you can simply substitute: $\\lim_{x\\to a} f(x) = f(a)$. (Trickier limits come later when substitution gives $0/0$.)",
      examples: [
        {
          type: "worked",
          prompt: "Evaluate $\\lim_{x\\to 2}(x^2 + 1)$.",
          steps: ["Polynomial → continuous → substitute.", "$2^2 + 1 = 5$."],
          answer: "$5$",
          selfExplain: "Why is substitution valid for a polynomial but not for every function?",
        },
      ],
      generator: "limitDirect",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u08-s02",
      name: "The power rule",
      lesson:
        "The **derivative** measures instantaneous rate of change — the slope of the tangent line. The power rule is the fastest way to differentiate a power:\n\n$$\\frac{d}{dx}\\left(a x^n\\right) = a\\,n\\,x^{\\,n-1}.$$\n\nBring the exponent down as a multiplier, then subtract 1 from the exponent.",
      examples: [
        {
          type: "worked",
          prompt: "Differentiate $f(x) = 3x^4$.",
          steps: ["Bring down the 4: $3\\cdot 4 = 12$.", "Reduce the power: $x^{4-1} = x^3$.", "$f'(x) = 12x^3$."],
          answer: "$f'(x) = 12x^3$",
        },
      ],
      generator: "powerRuleDerivative",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u08-s03",
      name: "Slope of a tangent line",
      lesson:
        "The derivative $f'(x)$ is itself a function: plug in an $x$-value and it returns the **slope of the tangent line** there. This connects the algebra of derivatives to the geometry of curves — and is the central idea of differential calculus.",
      examples: [
        {
          type: "worked",
          prompt: "Find the tangent slope of $f(x) = x^2$ at $x = 3$.",
          steps: ["$f'(x) = 2x$.", "$f'(3) = 2(3) = 6$."],
          answer: "slope $= 6$",
          selfExplain: "How is this 'instantaneous slope' different from the slope between two separate points?",
        },
      ],
      generator: "tangentSlope",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
  ],
};

export default unit;
