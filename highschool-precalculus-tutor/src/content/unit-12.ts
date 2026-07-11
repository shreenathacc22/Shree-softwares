import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-12",
  title: "Applications of Integration",
  blurb: "Use integration to solve real-world problems: areas, volumes, accumulation, and rates of change.",
  mcpsStandards: ["AP Calculus AB: Integration Applications", "Maryland College & Career Ready"],
  requires: "unit-11",
  skills: [
    {
      id: "u12-s01",
      name: "Area between curves",
      lesson:
        "When two functions intersect, the area between them from $x = a$ to $x = b$ is $\\displaystyle\\int_a^b [f(x) - g(x)]\\,dx$, where $f(x) \\geq g(x)$ on $[a,b]$.\n\nThis extends the idea of \"area under a curve\" to compare two functions. The key is: identify which function is larger, then integrate the difference.",
      examples: [
        {
          type: "worked",
          prompt: "Find the area between $f(x) = 2x$ and $g(x) = x^2$ from $x=0$ to $x=2$.",
          steps: [
            "At $x=1$: $f(1) = 2$ and $g(1) = 1$, so $f(x) \\geq g(x)$ on $[0,2]$.",
            "Area $= \\displaystyle\\int_0^2 (2x - x^2)\\,dx$.",
            "Antiderivative: $x^2 - \\tfrac{1}{3}x^3$.",
            "Evaluate: $[4 - \\tfrac{8}{3}] - [0] = \\tfrac{4}{3}$.",
          ],
          answer: "$\\tfrac{4}{3}$ square units",
          selfExplain: "Why do we subtract the lower curve from the upper? What would happen if we reversed them?",
        },
      ],
      generator: "areaBetweenCurves",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u12-s02",
      name: "Volume by disk method",
      lesson:
        "When you rotate a curve $y = f(x)$ around the $x$-axis, each thin vertical slice becomes a disk of radius $f(x)$ and thickness $dx$. The volume is:\n\n$$V = \\pi \\int_a^b [f(x)]^2\\,dx$$\n\nThe disk method works when rotating around the $x$-axis or $y$-axis. Always square the radius.",
      examples: [
        {
          type: "worked",
          prompt: "Find the volume when $f(x) = 3$ is rotated around the $x$-axis from $x=0$ to $x=4$.",
          steps: [
            "Each disk has radius $r(x) = 3$ (constant).",
            "Volume $= \\pi \\displaystyle\\int_0^4 3^2\\,dx = \\pi \\displaystyle\\int_0^4 9\\,dx$.",
            "$= 9\\pi [x]_0^4 = 9\\pi \\cdot 4 = 36\\pi$ cubic units.",
          ],
          answer: "$36\\pi$ cubic units",
          selfExplain: "Why do we square the radius? What is the area of each disk?",
        },
      ],
      generator: "volumeDiskMethod",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u12-s03",
      name: "Net change & accumulation",
      lesson:
        "The integral of a rate of change gives the total accumulation or net change:\n\n$$\\text{Net Change} = \\int_a^b v(t)\\,dt$$\n\nIf $v(t)$ is velocity, this gives displacement. If $v(t)$ is flow rate, this gives total volume accumulated. The rate of change is always the integrand.",
      examples: [
        {
          type: "worked",
          prompt: "Water flows into a pool at $5$ L/min for $10$ minutes. How much water accumulates?",
          steps: [
            "Rate of change: $r(t) = 5$ L/min (constant).",
            "Accumulation $= \\displaystyle\\int_0^{10} 5\\,dt$.",
            "$= 5[t]_0^{10} = 5 \\cdot 10 = 50$ liters.",
          ],
          answer: "$50$ liters",
          selfExplain: "Why is accumulation the integral of rate? What does each tiny piece contribute?",
        },
      ],
      generator: "netChangeFunction",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u12-s04",
      name: "Accumulation functions & total change",
      lesson:
        "An accumulation function $F(t) = \\int_a^t f(x)\\,dx$ tracks the total accumulated amount from $a$ to $t$. The Fundamental Theorem tells us $F'(t) = f(t)$.\n\nTo find total accumulation from $t=a$ to $t=b$, compute $\\int_a^b f(t)\\,dt$, which represents the area under the rate curve.",
      examples: [
        {
          type: "worked",
          prompt: "Customers arrive at a store at a rate of $10$ people per hour. From hour $2$ to hour $5$, how many customers arrive?",
          steps: [
            "Rate: $r(t) = 10$ people/hour.",
            "Total arrivals $= \\displaystyle\\int_2^5 10\\,dt$.",
            "$= 10[t]_2^5 = 10(5-2) = 30$ people.",
          ],
          answer: "$30$ people",
        },
      ],
      generator: "accumulationProblem",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u12-s05",
      name: "Average value of a function",
      lesson:
        "The average value of a function $f(x)$ on $[a,b]$ is:\n\n$$\\text{Average} = \\frac{1}{b-a} \\int_a^b f(x)\\,dx$$\n\nThis gives the height of a rectangle with the same area as the region under the curve. It's a powerful way to summarize a function's \"typical\" behavior on an interval.",
      examples: [
        {
          type: "worked",
          prompt: "Find the average value of $f(x) = 2x + 1$ on $[0, 3]$.",
          steps: [
            "Average $= \\dfrac{1}{3-0} \\displaystyle\\int_0^3 (2x+1)\\,dx$.",
            "$= \\dfrac{1}{3} [x^2 + x]_0^3 = \\dfrac{1}{3}(9+3) = 4$.",
          ],
          answer: "$4$",
          selfExplain: "Why divide by the length of the interval? What if the interval were twice as long?",
        },
      ],
      generator: "averageValueFunction",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
  ],
};

export default unit;
