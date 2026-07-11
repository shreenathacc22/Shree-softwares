import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-05",
  title: "Systems & Matrices",
  blurb: "Solving systems by elimination and the algebra of matrices.",
  mcpsStandards: ["MCPS Precalc Unit 5", "MD CCR: Reasoning with Equations & Inequalities"],
  requires: "unit-04",
  skills: [
    {
      id: "u05-s01",
      name: "Solving 2×2 systems",
      lesson:
        "A system of two equations is solved where both are true at once. The **elimination** method adds or subtracts the equations to cancel one variable, leaving a single equation to solve.",
      examples: [
        {
          type: "worked",
          prompt: "Solve $\\begin{cases} x+y=7 \\\\ x-y=1\\end{cases}$ for $x$.",
          steps: ["Add the equations: $2x = 8$.", "Divide: $x = 4$.", "(Then $y = 3$.)"],
          answer: "$x = 4$",
          selfExplain: "Why does adding the equations make the $y$ terms disappear here?",
        },
      ],
      generator: "solveSystem",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
    {
      id: "u05-s02",
      name: "Determinant of a 2×2 matrix",
      lesson:
        "For a matrix $\\begin{bmatrix} a & b \\\\ c & d\\end{bmatrix}$, the **determinant** is $ad-bc$. It tells you whether a system has a unique solution (nonzero determinant) and scales area under the transformation.",
      examples: [
        {
          type: "worked",
          prompt: "Find the determinant of $\\begin{bmatrix} 2 & 3 \\\\ 1 & 4\\end{bmatrix}$.",
          steps: ["$ad - bc = (2)(4) - (3)(1)$.", "$= 8 - 3 = 5$."],
          answer: "$5$",
        },
      ],
      generator: "determinant2x2",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
  ],
};

export default unit;
