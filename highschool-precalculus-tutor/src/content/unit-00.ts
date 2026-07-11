import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-00",
  title: "Foundations Gate",
  blurb: "Algebra 2 readiness — the skills every Precalculus topic leans on.",
  mcpsStandards: ["MD CCR: Building Functions", "MD CCR: Reasoning with Equations"],
  requires: null,
  skills: [
    {
      id: "u00-s01",
      name: "Function notation & evaluation",
      lesson:
        "A function is a rule that turns an input into one output. We write $f(x)$ to mean *the output of the rule named $f$ when the input is $x$*.\n\nTo **evaluate** $f$ at a number, replace every $x$ with that number and simplify. For example, if $f(x)=2x+1$, then $f(3)=2(3)+1=7$.",
      examples: [
        {
          type: "worked",
          prompt: "Evaluate $f(x)=3x-4$ at $x=2$.",
          steps: ["Replace $x$ with $2$: $3(2)-4$.", "Multiply: $6-4$.", "Subtract: $2$."],
          answer: "$f(2)=2$",
          selfExplain: "Why must we replace *every* $x$, not just one of them?",
        },
        {
          type: "completion",
          prompt: "Evaluate $f(x)=5x+2$ at $x=-1$. Finish: $5(-1)+2 = \\;?$",
          steps: ["$5(-1) = -5$.", "$-5 + 2 = -3$."],
          answer: "$f(-1) = -3$",
        },
      ],
      generator: "evaluateFunction",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
    {
      id: "u00-s02",
      name: "Slope as a rate of change",
      lesson:
        "Slope measures how fast $y$ changes as $x$ changes. Between two points $(x_1,y_1)$ and $(x_2,y_2)$:\n\n$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{\\text{rise}}{\\text{run}}.$$\n\nThis idea — a rate of change — becomes the *derivative* in calculus, so it is worth mastering now.",
      examples: [
        {
          type: "worked",
          prompt: "Find the slope through $(1,2)$ and $(4,11)$.",
          steps: ["Rise $= 11-2 = 9$.", "Run $= 4-1 = 3$.", "$m = 9/3 = 3$."],
          answer: "$m = 3$",
          selfExplain: "What does a slope of 3 tell you about how $y$ moves when $x$ goes up by 1?",
        },
      ],
      generator: "slopeFromPoints",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
    {
      id: "u00-s03",
      name: "Solving linear equations",
      lesson:
        "To solve $ax+b=c$, undo the operations in reverse: first move the constant, then divide by the coefficient. Whatever you do to one side, do to the other.",
      examples: [
        {
          type: "worked",
          prompt: "Solve $4x + 3 = 19$.",
          steps: ["Subtract 3: $4x = 16$.", "Divide by 4: $x = 4$."],
          answer: "$x = 4$",
        },
      ],
      generator: "solveLinear",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
    {
      id: "u00-s04",
      name: "Solving quadratics by factoring",
      lesson:
        "To solve $x^2+bx+c=0$, find two numbers that **multiply to $c$** and **add to $b$**. They give the factors $(x-r_1)(x-r_2)=0$, and the solutions are $x=r_1$ and $x=r_2$ (the zero-product property).",
      examples: [
        {
          type: "worked",
          prompt: "Solve $x^2 - 5x + 6 = 0$.",
          steps: [
            "Two numbers that multiply to 6 and add to −5: −2 and −3.",
            "Factor: $(x-2)(x-3)=0$.",
            "Set each factor to 0: $x=2$ or $x=3$.",
          ],
          answer: "$x = 2$ and $x = 3$",
          selfExplain: "Why does a product equal to zero force one of the factors to be zero?",
        },
      ],
      generator: "solveQuadraticFactor",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
  ],
};

export default unit;
