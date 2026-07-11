import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-06",
  title: "Discrete Math",
  blurb: "Counting, combinations, and arithmetic series.",
  mcpsStandards: ["MCPS Precalc Unit 6", "MD CCR: Conditional Probability & Counting"],
  requires: "unit-05",
  skills: [
    {
      id: "u06-s01",
      name: "Factorials",
      lesson:
        "$n!$ (\"$n$ factorial\") is the product of all whole numbers from $n$ down to $1$: $n! = n\\times(n-1)\\times\\cdots\\times 1$. It counts the number of ways to arrange $n$ distinct items in order. By definition $0! = 1$.",
      examples: [
        {
          type: "worked",
          prompt: "Evaluate $4!$.",
          steps: ["$4\\times 3\\times 2\\times 1$.", "$= 24$."],
          answer: "$24$",
        },
      ],
      generator: "factorialEval",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
    {
      id: "u06-s02",
      name: "Combinations",
      lesson:
        "A **combination** counts how many ways to choose $r$ items from $n$ when order doesn't matter:\n\n$$\\binom{n}{r} = \\frac{n!}{r!\\,(n-r)!}.$$\n\nIf order *did* matter, you'd use permutations ($n!/(n-r)!$) instead.",
      examples: [
        {
          type: "worked",
          prompt: "Compute $\\binom{5}{2}$.",
          steps: ["$\\frac{5!}{2!\\,3!} = \\frac{5\\cdot 4}{2\\cdot 1}$.", "$= \\frac{20}{2} = 10$."],
          answer: "$10$",
          selfExplain: "Why do we divide by $r!$ when order doesn't matter?",
        },
      ],
      generator: "combinations",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
    {
      id: "u06-s03",
      name: "Arithmetic series",
      lesson:
        "An arithmetic sequence adds a constant $d$ each step. The sum of the first $n$ terms is\n\n$$S_n = \\frac{n(a_1 + a_n)}{2},$$\n\nwhere $a_n = a_1 + (n-1)d$ is the last term — pairing first-with-last is the classic trick.",
      examples: [
        {
          type: "worked",
          prompt: "Sum the first 4 terms starting at 2 with difference 3.",
          steps: ["Terms: 2, 5, 8, 11; last term $a_4 = 11$.", "$S_4 = \\frac{4(2+11)}{2}$.", "$= \\frac{4\\cdot 13}{2} = 26$."],
          answer: "$26$",
        },
      ],
      generator: "arithmeticSeries",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
  ],
};

export default unit;
