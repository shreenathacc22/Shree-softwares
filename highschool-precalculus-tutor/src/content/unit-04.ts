import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-04",
  title: "Vectors, Parametrics & Polars",
  blurb: "Quantities with direction — magnitude, component arithmetic, and beyond.",
  mcpsStandards: ["MCPS Precalc Unit 4", "MD CCR: Vector & Matrix Quantities"],
  requires: "unit-03",
  skills: [
    {
      id: "u04-s01",
      name: "Vector magnitude",
      lesson:
        "A vector $\\langle a, b\\rangle$ has both direction and length. Its **magnitude** (length) comes straight from the Pythagorean theorem:\n\n$$\\|\\langle a,b\\rangle\\| = \\sqrt{a^2+b^2}.$$",
      examples: [
        {
          type: "worked",
          prompt: "Find the magnitude of $\\langle 3, 4\\rangle$.",
          steps: ["$\\sqrt{3^2+4^2}$.", "$=\\sqrt{9+16}=\\sqrt{25}$.", "$=5$."],
          answer: "$5$",
          selfExplain: "Why does the sign of a component not change the magnitude?",
        },
      ],
      generator: "vectorMagnitude",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
    {
      id: "u04-s02",
      name: "Vector addition",
      lesson:
        "To add vectors, add **matching components**: $\\langle a,b\\rangle + \\langle c,d\\rangle = \\langle a+c,\\; b+d\\rangle$. Geometrically this is placing them tip-to-tail.",
      examples: [
        {
          type: "worked",
          prompt: "Compute $\\langle 2,5\\rangle + \\langle 3,-1\\rangle$.",
          steps: ["x: $2+3 = 5$.", "y: $5+(-1) = 4$.", "Result: $\\langle 5,4\\rangle$."],
          answer: "$\\langle 5, 4\\rangle$",
        },
      ],
      generator: "vectorAdd",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
  ],
};

export default unit;
