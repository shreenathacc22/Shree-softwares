import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-01",
  title: "Polynomial, Power & Rational Functions",
  blurb: "End behavior, zeros & multiplicity, and asymptotes of rational functions.",
  mcpsStandards: ["MCPS Precalc Unit 1", "MD CCR: Interpreting Functions"],
  requires: "unit-00",
  skills: [
    {
      id: "u01-s01",
      name: "End behavior of polynomials",
      lesson:
        "As $x$ grows huge (positive or negative), the **leading term** dominates every other term. So the end behavior of a polynomial depends only on two things:\n\n- **Degree even or odd?** Even → both ends point the same way. Odd → ends point opposite ways.\n- **Leading coefficient sign?** Positive → the right end goes up; negative → the right end goes down.",
      examples: [
        {
          type: "worked",
          prompt: "Describe the end behavior of $f(x) = 2x^3 - 5x + 1$.",
          steps: [
            "Leading term is $2x^3$.",
            "Degree 3 is odd → ends go opposite directions.",
            "Coefficient $+2$ → right end up, so left end down.",
          ],
          answer: "Down on the left, up on the right.",
          selfExplain: "Why does only the leading term matter as $x$ gets very large?",
        },
      ],
      generator: "polynomialEndBehavior",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u01-s02",
      name: "Zeros and multiplicity",
      lesson:
        "A **zero** is an $x$-value where $f(x)=0$ — found by setting each factor to zero. The **multiplicity** is the exponent on that factor and controls the graph's shape there:\n\n- **Odd** multiplicity → the graph *crosses* the axis.\n- **Even** multiplicity → the graph *touches and bounces* off the axis.",
      examples: [
        {
          type: "worked",
          prompt: "Describe the behavior of $f(x) = (x-2)^2$ at its zero.",
          steps: ["Zero at $x=2$.", "Multiplicity 2 is even.", "Even → the graph touches and bounces."],
          answer: "Touches (bounces) at $x=2$.",
        },
      ],
      generator: "zerosAndMultiplicity",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u01-s03",
      name: "Vertical asymptotes of rational functions",
      lesson:
        "A rational function $\\frac{p(x)}{q(x)}$ blows up where the **denominator is zero** (and the numerator is not). Those $x$-values are **vertical asymptotes** — invisible vertical lines the graph rushes toward but never touches.",
      examples: [
        {
          type: "worked",
          prompt: "Find the vertical asymptote of $f(x) = \\dfrac{1}{x-3}$.",
          steps: ["Set the denominator to zero: $x-3=0$.", "Solve: $x=3$."],
          answer: "Vertical asymptote at $x=3$.",
          selfExplain: "Why does the function value grow without bound near $x=3$?",
        },
      ],
      generator: "rationalAsymptote",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
  ],
};

export default unit;
