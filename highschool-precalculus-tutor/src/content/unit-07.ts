import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-07",
  title: "Analytic Geometry",
  blurb: "Distance, circles, and conic sections in the coordinate plane.",
  mcpsStandards: ["MCPS Precalc Unit 7", "MD CCR: Expressing Geometric Properties with Equations"],
  requires: "unit-06",
  skills: [
    {
      id: "u07-s01",
      name: "The distance formula",
      lesson:
        "The distance between two points is the Pythagorean theorem in disguise:\n\n$$d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}.$$\n\nThe horizontal and vertical gaps are the legs; the distance is the hypotenuse.",
      examples: [
        {
          type: "worked",
          prompt: "Distance between $(0,0)$ and $(3,4)$.",
          steps: ["$\\sqrt{(3-0)^2+(4-0)^2}$.", "$=\\sqrt{9+16}=\\sqrt{25}$.", "$=5$."],
          answer: "$5$",
        },
      ],
      generator: "distanceFormula",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
    {
      id: "u07-s02",
      name: "Equation of a circle",
      lesson:
        "A circle with center $(h,k)$ and radius $r$ has equation\n\n$$(x-h)^2 + (y-k)^2 = r^2.$$\n\nWatch the signs: the center's coordinates appear *subtracted* inside the squares, and the right side is $r^2$, not $r$.",
      examples: [
        {
          type: "worked",
          prompt: "Circle with center $(2,-1)$, radius 3.",
          steps: ["$(x-2)^2 + (y-(-1))^2 = 3^2$.", "$(x-2)^2 + (y+1)^2 = 9$."],
          answer: "$(x-2)^2 + (y+1)^2 = 9$",
          selfExplain: "Why does a center of $(2,-1)$ produce $(y+1)$, not $(y-1)$?",
        },
      ],
      generator: "circleEquation",
      mastery: { requiredStreak: 3, minLevel: 3 },
    },
  ],
};

export default unit;
