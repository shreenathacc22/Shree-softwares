import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-02",
  title: "Exponential & Logarithmic Functions",
  blurb: "Logs as inverse exponents, log properties, and growth models.",
  mcpsStandards: ["MCPS Precalc Unit 2", "MD CCR: Linear, Quadratic & Exponential Models"],
  requires: "unit-01",
  skills: [
    {
      id: "u02-s01",
      name: "Evaluating logarithms",
      lesson:
        "A logarithm asks a question: $\\log_b(x)$ means *\"$b$ raised to what power gives $x$?\"* So $\\log_2(8)=3$ because $2^3=8$. Logs and exponentials are inverse operations.",
      examples: [
        {
          type: "worked",
          prompt: "Evaluate $\\log_3(81)$.",
          steps: ["Ask: 3 to what power is 81?", "$3^4 = 81$.", "So the answer is 4."],
          answer: "$\\log_3(81)=4$",
          selfExplain: "How are $\\log_b$ and $b^x$ related as inverse functions?",
        },
      ],
      generator: "evaluateLog",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u02-s02",
      name: "Properties of logarithms",
      lesson:
        "Logs turn multiplication into addition:\n\n$$\\log(ab) = \\log a + \\log b, \\quad \\log\\tfrac{a}{b} = \\log a - \\log b, \\quad \\log(a^n) = n\\log a.$$\n\nThese let you expand or condense expressions and are the key to solving exponential equations.",
      examples: [
        {
          type: "worked",
          prompt: "Rewrite $\\log(5\\cdot 7)$ as a sum.",
          steps: ["Product rule: $\\log(ab)=\\log a + \\log b$.", "$\\log(5\\cdot 7) = \\log 5 + \\log 7$."],
          answer: "$\\log 5 + \\log 7$",
        },
      ],
      generator: "logProperties",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u02-s03",
      name: "Exponential growth",
      lesson:
        "Quantities that grow by a fixed *percent* each period are modeled by $A = A_0(1+r)^t$, where $r$ is the rate as a decimal and $t$ is the number of periods. Each period multiplies by the same factor $(1+r)$.",
      examples: [
        {
          type: "worked",
          prompt: "$100$ grows by $10\\%$ per year. Value after 2 years?",
          steps: ["Growth factor $= 1.10$.", "$100(1.10)^2 = 100(1.21)$.", "$= 121$."],
          answer: "$121$",
          selfExplain: "Why isn't 2 years of 10% growth the same as a single 20% increase?",
        },
      ],
      generator: "compoundGrowth",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
  ],
};

export default unit;
