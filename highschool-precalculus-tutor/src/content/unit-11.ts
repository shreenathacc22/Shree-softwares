import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-11",
  title: "Integration Intro",
  blurb: "The reverse of the derivative: antiderivatives, integrals, and area under a curve.",
  mcpsStandards: ["AP Calculus AB Units 6-7", "Integration & Accumulation of Change"],
  requires: "unit-10",
  skills: [
    {
      id: "u11-s01",
      name: "Antiderivatives (reverse power rule)",
      lesson:
        "Integration **undoes** differentiation. To reverse the power rule, do the opposite of what you did before — **add 1 to the exponent, then divide by the new exponent**:\n\n$$\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C.$$\n\nThe $+C$ (constant of integration) appears because any constant differentiates to 0, so we can't know which constant was there originally.",
      examples: [
        {
          type: "worked",
          prompt: "Find $\\int 6x^2\\,dx$.",
          steps: [
            "Add 1 to the exponent: $x^2 \\to x^3$.",
            "Divide by the new exponent 3: $\\frac{6}{3}x^3 = 2x^3$.",
            "Add the constant: $2x^3 + C$.",
          ],
          answer: "$2x^3 + C$",
          selfExplain: "Why must every indefinite integral include $+C$?",
        },
      ],
      generator: "antiderivativePower",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u11-s02",
      name: "Integrating polynomials",
      lesson:
        "Just like differentiation, integration works **term by term**. Apply the reverse power rule to each piece and add a single $+C$ at the end:\n\n$$\\int (ax + b)\\,dx = \\frac{a}{2}x^2 + bx + C.$$\n\nRemember $\\int b\\,dx = bx$ — a constant integrates to a term with an $x$.",
      examples: [
        {
          type: "worked",
          prompt: "Find $\\int (4x + 3)\\,dx$.",
          steps: [
            "$\\int 4x\\,dx = \\frac{4}{2}x^2 = 2x^2$.",
            "$\\int 3\\,dx = 3x$.",
            "Combine with one constant: $2x^2 + 3x + C$.",
          ],
          answer: "$2x^2 + 3x + C$",
        },
      ],
      generator: "integratePolynomial",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u11-s03",
      name: "Definite integrals",
      lesson:
        "A **definite integral** has limits and produces a *number*, not a function. By the Fundamental Theorem of Calculus, find an antiderivative $F$ and subtract:\n\n$$\\int_a^b f(x)\\,dx = F(b) - F(a).$$\n\nNo $+C$ is needed — it cancels in the subtraction.",
      examples: [
        {
          type: "worked",
          prompt: "Evaluate $\\int_0^3 2x\\,dx$.",
          steps: [
            "Antiderivative of $2x$ is $x^2$.",
            "Evaluate at the limits: $F(3) - F(0) = 3^2 - 0^2$.",
            "$= 9 - 0 = 9$.",
          ],
          answer: "$9$",
          selfExplain: "Why does the $+C$ not matter for a definite integral?",
        },
      ],
      generator: "definiteIntegral",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u11-s04",
      name: "Area under a curve",
      lesson:
        "The big payoff of integration: the definite integral $\\int_a^b f(x)\\,dx$ equals the **area between the curve and the x-axis** from $a$ to $b$ (for $f(x) \\ge 0$). This connects the abstract antiderivative to a concrete, visual quantity — accumulated area.",
      examples: [
        {
          type: "worked",
          prompt: "Find the area under $f(x) = 2x$ from $x = 0$ to $x = 4$.",
          steps: [
            "Area $= \\int_0^4 2x\\,dx$.",
            "Antiderivative $x^2$; evaluate: $4^2 - 0^2 = 16$.",
            "(Check: it's a triangle, $\\tfrac12 \\cdot 4 \\cdot 8 = 16$.)",
          ],
          answer: "$16$",
          selfExplain: "Why does the area match the triangle formula here?",
        },
      ],
      generator: "areaUnderCurve",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
  ],
};

export default unit;
