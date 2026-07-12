// Randomized, quality-constrained problem generators.
// Each returns a fresh Problem; answers are kept integer-friendly where possible.

import type { Problem, Choice, Generator } from "../types";

// ---------- small RNG / helpers ----------
const ri = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const nz = (min: number, max: number) => {
  let v = 0;
  while (v === 0) v = ri(min, max);
  return v;
};
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const sign = (n: number) => (n < 0 ? "-" : "+");
const abs = Math.abs;

/** Build a shuffled multiple-choice set from a correct label + distractors. */
function mc(
  correct: string,
  distractors: { label: string; misconception: string }[]
): Choice[] {
  const choices: Choice[] = [
    { label: correct, correct: true },
    ...distractors.map((d) => ({ label: d.label, misconception: d.misconception })),
  ];
  return shuffle(choices);
}

// term like "2x^3", "-x", "+5"
function term(coef: number, varName: string, power: number, first: boolean) {
  if (coef === 0) return "";
  const s = coef < 0 ? "-" : first ? "" : "+";
  let c = abs(coef);
  let body: string;
  if (power === 0) body = `${c}`;
  else {
    const cc = c === 1 ? "" : `${c}`;
    body = power === 1 ? `${cc}${varName}` : `${cc}${varName}^{${power}}`;
  }
  return `${s}${body}`;
}

// ================= UNIT 0 — Foundations =================

const evaluateFunction: Generator = (): Problem => {
  const a = nz(2, 5),
    b = nz(-6, 6),
    x = ri(-4, 4);
  const val = a * x + b;
  return {
    prompt: `Given $f(x) = ${term(a, "x", 1, true)} ${term(b, "x", 0, false)}$, find $f(${x})$.`,
    answerType: "numeric",
    numericAnswer: val,
    answerDisplay: `${val}`,
    hints: [
      `Substitute $x = ${x}$ into the rule.`,
      `Compute $${a}\\cdot(${x}) ${sign(b)} ${abs(b)}$.`,
    ],
    explanation: `$f(${x}) = ${a}(${x}) ${sign(b)} ${abs(b)} = ${val}$.`,
  };
};

const slopeFromPoints: Generator = (): Problem => {
  const x1 = ri(-4, 0),
    x2 = ri(1, 5),
    y1 = ri(-5, 5);
  const m = nz(-3, 3);
  const y2 = y1 + m * (x2 - x1);
  return {
    prompt: `Find the slope of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
    answerType: "numeric",
    numericAnswer: m,
    answerDisplay: `${m}`,
    hints: [
      `Slope $= \\dfrac{y_2 - y_1}{x_2 - x_1}$.`,
      `$= \\dfrac{${y2} - (${y1})}{${x2} - (${x1})}$.`,
    ],
    explanation: `$m = \\dfrac{${y2}-(${y1})}{${x2}-(${x1})} = \\dfrac{${y2 - y1}}{${x2 - x1}} = ${m}$.`,
  };
};

const solveLinear: Generator = (): Problem => {
  const a = nz(2, 6),
    x = ri(-5, 5),
    b = nz(-8, 8);
  const c = a * x + b;
  return {
    prompt: `Solve for $x$:  $${a}x ${sign(b)} ${abs(b)} = ${c}$.`,
    answerType: "numeric",
    numericAnswer: x,
    answerDisplay: `${x}`,
    hints: [
      `Move the constant: $${a}x = ${c} ${sign(-b)} ${abs(b)}$.`,
      `Divide both sides by $${a}$.`,
    ],
    explanation: `$${a}x = ${c - b}$, so $x = ${x}$.`,
  };
};

const solveQuadraticFactor: Generator = (): Problem => {
  let r1 = nz(-5, 5);
  let r2 = nz(-5, 5);
  // Reject pairs that would make a distractor equal the correct answer:
  //  - r2 === r1  : need two distinct roots
  //  - r2 === -r1 : symmetric roots make the "flipped signs" distractor the
  //                 SAME set as the answer (and render an ugly "+0x")
  //  - {-2, 1}    : makes the "roots off coefficients" distractor equal the answer
  const badPair = () => {
    if (r2 === r1 || r2 === -r1) return true;
    const s = [r1, r2].sort((p, q) => p - q);
    return s[0] === -2 && s[1] === 1;
  };
  while (badPair()) {
    r1 = nz(-5, 5);
    r2 = nz(-5, 5);
  }
  // (x - r1)(x - r2) = x^2 - (r1+r2)x + r1 r2
  const b = -(r1 + r2),
    c = r1 * r2;
  const roots = [r1, r2].sort((p, q) => p - q);
  const correct = `$x = ${roots[0]}$ and $x = ${roots[1]}$`;
  return {
    prompt: `Solve by factoring:  $x^2 ${sign(b)} ${abs(b)}x ${sign(c)} ${abs(c)} = 0$.`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$x = ${-roots[0]}$ and $x = ${-roots[1]}$`,
        misconception: "Flipped the signs of the roots — a factor (x − r) gives root +r, not −r.",
      },
      {
        label: `$x = ${b}$ and $x = ${c}$`,
        misconception: "Read the roots straight off the coefficients instead of factoring.",
      },
      {
        label: `$x = ${roots[0]}$ only`,
        misconception: "Found one root but forgot a quadratic has two solutions.",
      },
    ]),
    hints: [
      `Find two numbers that multiply to $${c}$ and add to $${b}$.`,
      `Those numbers are $${-r1}$ and $${-r2}$ inside the factors.`,
    ],
    explanation: `It factors as $(x ${sign(-r1)} ${abs(r1)})(x ${sign(-r2)} ${abs(r2)}) = 0$, giving $x = ${roots[0]}$ and $x = ${roots[1]}$.`,
  };
};

// ================= UNIT 1 — Polynomial / Power / Rational =================

const polynomialEndBehavior: Generator = (): Problem => {
  const degree = pick([2, 3, 4, 5]);
  const lead = nz(-4, 4);
  const even = degree % 2 === 0;
  const pos = lead > 0;
  let correct: string;
  if (even && pos) correct = "Up on both ends ($+\\infty$, $+\\infty$)";
  else if (even && !pos) correct = "Down on both ends ($-\\infty$, $-\\infty$)";
  else if (!even && pos) correct = "Down-left, Up-right ($-\\infty$, $+\\infty$)";
  else correct = "Up-left, Down-right ($+\\infty$, $-\\infty$)";
  const all = [
    "Up on both ends ($+\\infty$, $+\\infty$)",
    "Down on both ends ($-\\infty$, $-\\infty$)",
    "Down-left, Up-right ($-\\infty$, $+\\infty$)",
    "Up-left, Down-right ($+\\infty$, $-\\infty$)",
  ];
  const distractors = all
    .filter((x) => x !== correct)
    .map((label) => ({
      label,
      misconception:
        "End behavior is set by the leading term's degree (even/odd) and sign — recheck both.",
    }));
  const lt = `${lead === 1 ? "" : lead === -1 ? "-" : lead}x^{${degree}}`;
  return {
    prompt: `A polynomial has leading term $${lt}$. Describe its end behavior.`,
    answerType: "multiple-choice",
    choices: mc(correct, distractors.slice(0, 3)),
    hints: [
      `Even degree → both ends go the same way; odd degree → opposite ways.`,
      `Positive leading coefficient → right end goes up.`,
    ],
    explanation: `Degree ${degree} is ${even ? "even" : "odd"} and the lead coefficient is ${pos ? "positive" : "negative"}, so: ${correct}.`,
  };
};

const zerosAndMultiplicity: Generator = (): Problem => {
  const r = nz(-4, 4);
  const m = pick([2, 3]);
  const behavior =
    m % 2 === 0
      ? `touches the x-axis (bounces) at $x = ${r}$`
      : `crosses the x-axis (flattening) at $x = ${r}$`;
  const wrong =
    m % 2 === 0
      ? `crosses the x-axis at $x = ${r}$`
      : `touches and bounces at $x = ${r}$`;
  return {
    prompt: `For $f(x) = (x ${sign(-r)} ${abs(r)})^{${m}}$, describe the graph's behavior at its zero.`,
    answerType: "multiple-choice",
    choices: mc(behavior, [
      {
        label: wrong,
        misconception:
          "Even multiplicity → the graph touches/bounces; odd multiplicity → it crosses.",
      },
      {
        label: `has a vertical asymptote at $x = ${r}$`,
        misconception: "A factor in the numerator gives a zero, not an asymptote.",
      },
      {
        label: `has no real zero`,
        misconception: `$(x ${sign(-r)} ${abs(r)})=0$ gives the real zero $x=${r}$.`,
      },
    ]),
    hints: [
      `Set the factor equal to zero to find the zero.`,
      `Multiplicity ${m} is ${m % 2 === 0 ? "even" : "odd"} — that decides touch vs. cross.`,
    ],
    explanation: `The zero is $x=${r}$ with multiplicity ${m} (${m % 2 === 0 ? "even" : "odd"}), so the graph ${behavior}.`,
  };
};

const rationalAsymptote: Generator = (): Problem => {
  const a = nz(-3, 3); // vertical asymptote at x = a (denominator zero)
  const correct = `Vertical asymptote at $x = ${a}$`;
  return {
    prompt: `Where is the vertical asymptote of $f(x) = \\dfrac{1}{x ${sign(-a)} ${abs(a)}}$?`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `Vertical asymptote at $x = ${-a}$`,
        misconception: "Set the denominator to zero: $x " + sign(-a) + " " + abs(a) + " = 0$ gives $x = " + a + "$, not the opposite sign.",
      },
      {
        label: `Vertical asymptote at $y = ${a}$`,
        misconception: "A vertical asymptote is an x-value, not a y-value.",
      },
      {
        label: `No vertical asymptote`,
        misconception: "The denominator can be zero, so there is a vertical asymptote.",
      },
    ]),
    hints: [
      `A vertical asymptote occurs where the denominator equals zero.`,
      `Solve $x ${sign(-a)} ${abs(a)} = 0$.`,
    ],
    explanation: `Setting $x ${sign(-a)} ${abs(a)} = 0$ gives $x = ${a}$.`,
  };
};

// ================= UNIT 2 — Exponential / Logarithmic =================

const evaluateLog: Generator = (): Problem => {
  const base = pick([2, 3, 5, 10]);
  const exp = ri(1, 4);
  const arg = Math.pow(base, exp);
  return {
    prompt: `Evaluate  $\\log_{${base}}(${arg})$.`,
    answerType: "numeric",
    numericAnswer: exp,
    answerDisplay: `${exp}`,
    hints: [
      `Ask: $${base}$ to what power gives $${arg}$?`,
      `$${base}^{?} = ${arg}$.`,
    ],
    explanation: `$${base}^{${exp}} = ${arg}$, so $\\log_{${base}}(${arg}) = ${exp}$.`,
  };
};

const logProperties: Generator = (): Problem => {
  const x = ri(2, 6);
  let y = ri(2, 6);
  // Avoid x+y === x*y (only 2,2 in this range): there log(x+y) == log(x*y),
  // making the "added the arguments" distractor a second correct answer.
  while (x + y === x * y) y = ri(2, 6);
  const correct = `$\\log(${x}) + \\log(${y})$`;
  return {
    prompt: `Which expression equals  $\\log(${x} \\cdot ${y})$?`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$\\log(${x}) \\cdot \\log(${y})$`,
        misconception: "The product rule turns a product into a SUM of logs, not a product.",
      },
      {
        label: `$\\log(${x}) - \\log(${y})$`,
        misconception: "Subtraction is the quotient rule; a product becomes addition.",
      },
      {
        label: `$\\log(${x + y})$`,
        misconception: "You cannot add the arguments — log of a product splits into a sum of logs.",
      },
    ]),
    hints: [
      `Recall the product rule: $\\log(ab) = \\log a + \\log b$.`,
    ],
    explanation: `Product rule: $\\log(${x}\\cdot${y}) = \\log(${x}) + \\log(${y})$.`,
  };
};

const compoundGrowth: Generator = (): Problem => {
  const p = pick([100, 200, 500, 1000]);
  const ratePct = pick([5, 10, 20, 25, 50, 100]);
  const t = ri(1, 3);
  const factor = 1 + ratePct / 100;
  const val = Math.round(p * Math.pow(factor, t) * 100) / 100;
  return {
    prompt: `A quantity starts at $${p}$ and grows by $${ratePct}\\%$ each year. What is its value after $${t}$ year(s)? Round to 2 decimal places.`,
    answerType: "numeric",
    numericAnswer: val,
    answerDisplay: `${val}`,
    hints: [
      `Each year multiply by $1 + ${ratePct}/100 = ${factor}$.`,
      `Value $= ${p}\\cdot(${factor})^{${t}}$.`,
    ],
    explanation: `$${p}\\cdot(${factor})^{${t}} = ${val}$.`,
  };
};

// ================= UNIT 3 — Trigonometry =================

const degToRad: Generator = (): Problem => {
  const deg = pick([30, 45, 60, 90, 120, 180, 270, 360]);
  const g = gcd(deg, 180);
  const num = deg / g;
  const den = 180 / g;
  // Clean coefficient of pi, e.g. "\dfrac{2}{3}\pi", "2\pi", or just "\pi".
  const coef = den === 1 ? (num === 1 ? "" : `${num}`) : `\\dfrac{${num}}{${den}}`;
  const piDisp = `${coef}\\pi`;
  const approx = ((deg / 180) * Math.PI).toFixed(4);
  return {
    prompt: `Convert $${deg}^\\circ$ to radians. Enter a decimal (using $\\pi \\approx 3.14159$) or an exact form like 2pi/3.`,
    answerType: "numeric",
    numericAnswer: (deg / 180) * Math.PI,
    answerDisplay: `$${piDisp} \\approx ${approx}$`,
    hints: [
      `Multiply degrees by $\\dfrac{\\pi}{180}$.`,
      `$${deg}\\cdot\\dfrac{\\pi}{180} = ${piDisp} \\approx ${approx}$.`,
    ],
    explanation: `$${deg}^\\circ = ${deg}\\cdot\\dfrac{\\pi}{180} = ${piDisp} \\approx ${approx}$.`,
  };
};

const unitCircleValue: Generator = (): Problem => {
  const data: { ang: string; fn: string; val: string; num: number }[] = [
    { ang: "0", fn: "\\sin", val: "0", num: 0 },
    { ang: "0", fn: "\\cos", val: "1", num: 1 },
    { ang: "\\dfrac{\\pi}{2}", fn: "\\sin", val: "1", num: 1 },
    { ang: "\\dfrac{\\pi}{2}", fn: "\\cos", val: "0", num: 0 },
    { ang: "\\pi", fn: "\\sin", val: "0", num: 0 },
    { ang: "\\pi", fn: "\\cos", val: "-1", num: -1 },
    { ang: "\\dfrac{\\pi}{6}", fn: "\\sin", val: "\\dfrac{1}{2}", num: 0.5 },
    { ang: "\\dfrac{\\pi}{3}", fn: "\\cos", val: "\\dfrac{1}{2}", num: 0.5 },
  ];
  const q = pick(data);
  const correct = `$${q.val}$`;
  const distractorVals = ["0", "1", "-1", "\\dfrac{1}{2}"].filter((v) => v !== q.val);
  return {
    prompt: `Evaluate  $${q.fn}\\left(${q.ang}\\right)$.`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$${distractorVals[0]}$`,
        misconception: "Mixed up sine and cosine, or misread the reference angle on the unit circle.",
      },
      {
        label: `$${distractorVals[1]}$`,
        misconception: "Recheck the coordinates on the unit circle: cosine is x, sine is y.",
      },
      {
        label: `$${distractorVals[2]}$`,
        misconception: "Sign error — note which quadrant the angle lands in.",
      },
    ]),
    hints: [
      `On the unit circle, a point is $(\\cos\\theta, \\sin\\theta)$.`,
      `Locate the angle and read the right coordinate.`,
    ],
    explanation: `$${q.fn}(${q.ang}) = ${q.val}$.`,
  };
};

// Pythagorean triples used for exact-fraction trig values.
const TRIG_TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
];

const reciprocalQuotientIdentity: Generator = (): Problem => {
  const items: { expr: string; simplified: string; distractors: { label: string; misconception: string }[] }[] = [
    {
      expr: "\\sec\\theta\\cdot\\cot\\theta",
      simplified: "\\csc\\theta",
      distractors: [
        { label: "$\\sec\\theta$", misconception: "Rewrite both factors in sine and cosine first, then cancel." },
        { label: "$\\tan\\theta$", misconception: "Cotangent is cos/sin, not sin/cos — the cosines cancel here." },
        { label: "$1$", misconception: "Only one factor cancels; a $\\frac{1}{\\sin\\theta}$ remains." },
      ],
    },
    {
      expr: "\\tan\\theta\\cdot\\csc\\theta",
      simplified: "\\sec\\theta",
      distractors: [
        { label: "$\\csc\\theta$", misconception: "Rewrite $\\tan\\theta=\\frac{\\sin\\theta}{\\cos\\theta}$: the sines cancel, leaving $\\frac{1}{\\cos\\theta}$." },
        { label: "$\\cot\\theta$", misconception: "Multiplying by cosecant cancels the sine in tangent, not the cosine." },
        { label: "$\\sin\\theta$", misconception: "Check: $\\frac{\\sin\\theta}{\\cos\\theta}\\cdot\\frac{1}{\\sin\\theta} = \\frac{1}{\\cos\\theta}$." },
      ],
    },
    {
      expr: "\\dfrac{\\sin\\theta}{\\tan\\theta}",
      simplified: "\\cos\\theta",
      distractors: [
        { label: "$\\sin\\theta$", misconception: "Dividing by $\\frac{\\sin\\theta}{\\cos\\theta}$ multiplies by its reciprocal $\\frac{\\cos\\theta}{\\sin\\theta}$." },
        { label: "$\\sec\\theta$", misconception: "The result is cosine itself, not its reciprocal." },
        { label: "$\\cot\\theta$", misconception: "The sines cancel completely — no sine remains in the answer." },
      ],
    },
    {
      expr: "\\cot\\theta\\cdot\\sin\\theta",
      simplified: "\\cos\\theta",
      distractors: [
        { label: "$\\sin\\theta$", misconception: "Cotangent is $\\frac{\\cos\\theta}{\\sin\\theta}$; the sines cancel, leaving cosine." },
        { label: "$\\tan\\theta$", misconception: "Cotangent, not tangent, appears here — its numerator is cosine." },
        { label: "$\\csc\\theta$", misconception: "Nothing here produces a reciprocal of sine; the sines cancel." },
      ],
    },
    {
      expr: "\\dfrac{\\csc\\theta}{\\sec\\theta}",
      simplified: "\\cot\\theta",
      distractors: [
        { label: "$\\tan\\theta$", misconception: "$\\frac{1/\\sin\\theta}{1/\\cos\\theta} = \\frac{\\cos\\theta}{\\sin\\theta}$, which is cotangent." },
        { label: "$1$", misconception: "Cosecant and secant are reciprocals of different functions — they don't cancel." },
        { label: "$\\sin\\theta\\cos\\theta$", misconception: "Dividing fractions multiplies by the reciprocal; the result is a ratio, not a product." },
      ],
    },
  ];
  const q = pick(items);
  return {
    prompt: `Simplify  $${q.expr}$.`,
    answerType: "multiple-choice",
    choices: mc(`$${q.simplified}$`, q.distractors),
    hints: [
      `Rewrite every factor using only $\\sin\\theta$ and $\\cos\\theta$.`,
      `$\\sec = \\frac{1}{\\cos}$, $\\csc = \\frac{1}{\\sin}$, $\\tan = \\frac{\\sin}{\\cos}$, $\\cot = \\frac{\\cos}{\\sin}$ — then cancel.`,
    ],
    explanation: `Writing $${q.expr}$ in sines and cosines and cancelling gives $${q.simplified}$.`,
  };
};

const pythagoreanIdentity: Generator = (): Problem => {
  const [a, b, c] = pick(TRIG_TRIPLES);
  // given sine (or cosine), find the other; quadrant decides sign
  const givenSin = pick([true, false]);
  const quadrant = pick([1, 2, 3, 4]);
  const sinPos = quadrant === 1 || quadrant === 2;
  const cosPos = quadrant === 1 || quadrant === 4;
  const sinNum = (givenSin ? a : b) * (sinPos ? 1 : -1);
  const cosNum = (givenSin ? b : a) * (cosPos ? 1 : -1);
  const given = givenSin
    ? { fn: "\\sin", num: sinNum }
    : { fn: "\\cos", num: cosNum };
  const want = givenSin
    ? { fn: "\\cos", num: cosNum }
    : { fn: "\\sin", num: sinNum };
  const frac = (n: number) =>
    `${n < 0 ? "-" : ""}\\dfrac{${abs(n)}}{${c}}`;
  const quadName = ["I", "II", "III", "IV"][quadrant - 1];
  return {
    prompt: `If $${given.fn}\\theta = ${frac(given.num)}$ and $\\theta$ is in Quadrant ${quadName}, find $${want.fn}\\theta$. Enter a fraction like 4/5 or -4/5.`,
    answerType: "numeric",
    numericAnswer: want.num / c,
    answerDisplay: `$${frac(want.num)}$`,
    hints: [
      `Use $\\sin^2\\theta + \\cos^2\\theta = 1$ to find the missing value up to sign.`,
      `$${want.fn}^2\\theta = 1 - \\left(${frac(given.num)}\\right)^2 = \\dfrac{${abs(want.num) ** 2}}{${c * c}}$ — now pick the sign for Quadrant ${quadName}.`,
    ],
    explanation: `$${want.fn}^2\\theta = 1 - \\dfrac{${given.num * given.num}}{${c * c}} = \\dfrac{${want.num * want.num}}{${c * c}}$, so $${want.fn}\\theta = \\pm\\dfrac{${abs(want.num)}}{${c}}$. In Quadrant ${quadName}, ${want.fn === "\\sin" ? "sine" : "cosine"} is ${want.num > 0 ? "positive" : "negative"}: $${frac(want.num)}$.`,
  };
};

const evenOddCofunction: Generator = (): Problem => {
  const items: { expr: string; simplified: string; distractors: { label: string; misconception: string }[] }[] = [
    {
      expr: "\\sin(-\\theta)",
      simplified: "-\\sin\\theta",
      distractors: [
        { label: "$\\sin\\theta$", misconception: "Sine is an odd function — negating the angle negates the value." },
        { label: "$\\cos\\theta$", misconception: "Negating the angle doesn't change sine into cosine." },
        { label: "$-\\cos\\theta$", misconception: "Reflection over the x-axis flips the y-coordinate (sine), keeping it a sine." },
      ],
    },
    {
      expr: "\\cos(-\\theta)",
      simplified: "\\cos\\theta",
      distractors: [
        { label: "$-\\cos\\theta$", misconception: "Cosine is an even function — it ignores the sign of the angle." },
        { label: "$\\sin\\theta$", misconception: "Negating the angle doesn't change cosine into sine." },
        { label: "$-\\sin\\theta$", misconception: "Reflection over the x-axis keeps the x-coordinate (cosine) unchanged." },
      ],
    },
    {
      expr: "\\tan(-\\theta)",
      simplified: "-\\tan\\theta",
      distractors: [
        { label: "$\\tan\\theta$", misconception: "Tangent is odd: $\\tan(-\\theta)=\\frac{-\\sin\\theta}{\\cos\\theta}=-\\tan\\theta$." },
        { label: "$\\cot\\theta$", misconception: "Negating the angle doesn't swap tangent with cotangent — cofunctions come from complements." },
        { label: "$-\\cot\\theta$", misconception: "Only the sign changes; the function stays a tangent." },
      ],
    },
    {
      expr: "\\sin\\left(\\tfrac{\\pi}{2}-\\theta\\right)",
      simplified: "\\cos\\theta",
      distractors: [
        { label: "$\\sin\\theta$", misconception: "Complementary angles swap sine and cosine — that's the cofunction identity." },
        { label: "$-\\cos\\theta$", misconception: "No sign change occurs for the cofunction of a complement." },
        { label: "$-\\sin\\theta$", misconception: "This is a cofunction (complement) identity, not a negative-angle identity." },
      ],
    },
    {
      expr: "\\cos\\left(\\tfrac{\\pi}{2}-\\theta\\right)",
      simplified: "\\sin\\theta",
      distractors: [
        { label: "$\\cos\\theta$", misconception: "Complementary angles swap cosine and sine — that's the cofunction identity." },
        { label: "$-\\sin\\theta$", misconception: "No sign change occurs for the cofunction of a complement." },
        { label: "$-\\cos\\theta$", misconception: "This is a cofunction (complement) identity, not a negative-angle identity." },
      ],
    },
    {
      expr: "\\sin(-\\theta)\\cos(-\\theta)",
      simplified: "-\\sin\\theta\\cos\\theta",
      distractors: [
        { label: "$\\sin\\theta\\cos\\theta$", misconception: "Sine is odd, so exactly one negative sign survives the product." },
        { label: "$-\\cos^2\\theta$", misconception: "Each factor keeps its own function; only the sine picks up a sign." },
        { label: "$\\sin\\theta - \\cos\\theta$", misconception: "This is a product of the two identities, not a difference." },
      ],
    },
  ];
  const q = pick(items);
  return {
    prompt: `Simplify  $${q.expr}$.`,
    answerType: "multiple-choice",
    choices: mc(`$${q.simplified}$`, q.distractors),
    hints: [
      `Cosine is even; sine and tangent are odd. Cofunctions: $\\sin(\\tfrac{\\pi}{2}-\\theta)=\\cos\\theta$.`,
      `Picture the unit circle: $-\\theta$ reflects the point over the x-axis, so $y$ flips and $x$ doesn't.`,
    ],
    explanation: `$${q.expr} = ${q.simplified}$.`,
  };
};

const sumDifferenceFormula: Generator = (): Problem => {
  const items: { prompt: string; correct: string; distractors: { label: string; misconception: string }[]; explanation: string }[] = [
    {
      prompt: "Find the exact value of $\\sin(75^\\circ)$.",
      correct: "$\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$",
      distractors: [
        { label: "$\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$", misconception: "That's $\\sin(15^\\circ)$ — for $45^\\circ + 30^\\circ$ the sine formula uses a plus sign." },
        { label: "$\\dfrac{\\sqrt{3}+\\sqrt{2}}{4}$", misconception: "Multiply the pairs fully: $\\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt3}{2}=\\frac{\\sqrt6}{4}$." },
        { label: "$\\dfrac{\\sqrt{2}+1}{2}$", misconception: "Sine values never exceed 1 — recheck each product of exact values." },
      ],
      explanation: "$\\sin(45^\\circ+30^\\circ) = \\sin 45^\\circ\\cos 30^\\circ + \\cos 45^\\circ\\sin 30^\\circ = \\frac{\\sqrt6}{4} + \\frac{\\sqrt2}{4} = \\frac{\\sqrt6+\\sqrt2}{4}$.",
    },
    {
      prompt: "Find the exact value of $\\cos(75^\\circ)$.",
      correct: "$\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$",
      distractors: [
        { label: "$\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$", misconception: "For cosine of a sum the middle sign flips to minus: $\\cos A\\cos B - \\sin A\\sin B$." },
        { label: "$\\dfrac{\\sqrt{2}-\\sqrt{6}}{4}$", misconception: "$75^\\circ$ is in Quadrant I, so its cosine must be positive." },
        { label: "$\\dfrac{\\sqrt{3}-1}{4}$", misconception: "Keep the radicals: $\\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt3}{2}=\\frac{\\sqrt6}{4}$, not $\\frac{\\sqrt3}{4}$." },
      ],
      explanation: "$\\cos(45^\\circ+30^\\circ) = \\cos 45^\\circ\\cos 30^\\circ - \\sin 45^\\circ\\sin 30^\\circ = \\frac{\\sqrt6}{4} - \\frac{\\sqrt2}{4} = \\frac{\\sqrt6-\\sqrt2}{4}$.",
    },
    {
      prompt: "Find the exact value of $\\cos(15^\\circ)$.",
      correct: "$\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$",
      distractors: [
        { label: "$\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$", misconception: "For $\\cos(45^\\circ-30^\\circ)$ the sign flips to plus: $\\cos A\\cos B + \\sin A\\sin B$." },
        { label: "$\\dfrac{\\sqrt{3}+\\sqrt{2}}{4}$", misconception: "Multiply the pairs fully: $\\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt3}{2}=\\frac{\\sqrt6}{4}$." },
        { label: "$\\dfrac{2+\\sqrt{3}}{4}$", misconception: "This mixes up the half-angle form — use the difference formula directly." },
      ],
      explanation: "$\\cos(45^\\circ-30^\\circ) = \\cos 45^\\circ\\cos 30^\\circ + \\sin 45^\\circ\\sin 30^\\circ = \\frac{\\sqrt6+\\sqrt2}{4}$.",
    },
    {
      prompt: "Find the exact value of $\\sin(15^\\circ)$.",
      correct: "$\\dfrac{\\sqrt{6}-\\sqrt{2}}{4}$",
      distractors: [
        { label: "$\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$", misconception: "That's $\\sin(75^\\circ)$ — for $45^\\circ - 30^\\circ$ the sine formula uses a minus sign." },
        { label: "$\\dfrac{\\sqrt{2}-\\sqrt{6}}{4}$", misconception: "$15^\\circ$ is in Quadrant I, so its sine must be positive." },
        { label: "$\\dfrac{1-\\sqrt{3}}{4}$", misconception: "Keep the radicals from each product: $\\frac{\\sqrt2}{2}\\cdot\\frac{\\sqrt3}{2}=\\frac{\\sqrt6}{4}$." },
      ],
      explanation: "$\\sin(45^\\circ-30^\\circ) = \\sin 45^\\circ\\cos 30^\\circ - \\cos 45^\\circ\\sin 30^\\circ = \\frac{\\sqrt6-\\sqrt2}{4}$.",
    },
    {
      prompt: "Which expression equals $\\sin(A+B)$?",
      correct: "$\\sin A\\cos B + \\cos A\\sin B$",
      distractors: [
        { label: "$\\sin A\\cos B - \\cos A\\sin B$", misconception: "That's $\\sin(A-B)$; the sum formula keeps the plus sign." },
        { label: "$\\cos A\\cos B - \\sin A\\sin B$", misconception: "That's $\\cos(A+B)$ — sine's formula mixes sine and cosine." },
        { label: "$\\sin A + \\sin B$", misconception: "Sine doesn't distribute over addition — test with $A=B=45^\\circ$." },
      ],
      explanation: "$\\sin(A+B) = \\sin A\\cos B + \\cos A\\sin B$; matching signs for sine, flipped for cosine.",
    },
    {
      prompt: "Which expression equals $\\cos(A-B)$?",
      correct: "$\\cos A\\cos B + \\sin A\\sin B$",
      distractors: [
        { label: "$\\cos A\\cos B - \\sin A\\sin B$", misconception: "That's $\\cos(A+B)$ — for cosine the middle sign flips." },
        { label: "$\\sin A\\cos B - \\cos A\\sin B$", misconception: "That's $\\sin(A-B)$ — cosine's formula pairs like functions." },
        { label: "$\\cos A - \\cos B$", misconception: "Cosine doesn't distribute over subtraction — test with $A=B$." },
      ],
      explanation: "$\\cos(A-B) = \\cos A\\cos B + \\sin A\\sin B$; the sign flips relative to the angle operation.",
    },
  ];
  const q = pick(items);
  return {
    prompt: q.prompt,
    answerType: "multiple-choice",
    choices: mc(q.correct, q.distractors),
    hints: [
      `Break the angle into two known ones ($30^\\circ$, $45^\\circ$, $60^\\circ$) if it isn't already split.`,
      `Sine: same sign, mixed functions. Cosine: flipped sign, matched functions.`,
    ],
    explanation: q.explanation,
  };
};

const doubleAngleFormula: Generator = (): Problem => {
  const [a, b, c] = pick(TRIG_TRIPLES);
  const quadrant = pick([1, 2]);
  const sinNum = a; // sine positive in QI and QII
  const cosNum = quadrant === 1 ? b : -b;
  const which = pick(["sin", "cos"]);
  const frac = (n: number, d: number) => `${n < 0 ? "-" : ""}\\dfrac{${abs(n)}}{${d}}`;
  const quadName = quadrant === 1 ? "I" : "II";
  if (which === "sin") {
    const val = 2 * sinNum * cosNum;
    return {
      prompt: `If $\\sin\\theta = ${frac(sinNum, c)}$ and $\\theta$ is in Quadrant ${quadName}, find $\\sin 2\\theta$. Enter a fraction like 24/25 or -24/25.`,
      answerType: "numeric",
      numericAnswer: val / (c * c),
      answerDisplay: `$${frac(val, c * c)}$`,
      hints: [
        `First find $\\cos\\theta$ from $\\sin^2\\theta + \\cos^2\\theta = 1$ (mind the quadrant sign).`,
        `Then $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta = 2\\cdot${frac(sinNum, c)}\\cdot${frac(cosNum, c)}$.`,
      ],
      explanation: `In Quadrant ${quadName}, $\\cos\\theta = ${frac(cosNum, c)}$. Then $\\sin 2\\theta = 2\\cdot${frac(sinNum, c)}\\cdot${frac(cosNum, c)} = ${frac(val, c * c)}$.`,
    };
  }
  const val = cosNum * cosNum - sinNum * sinNum;
  return {
    prompt: `If $\\sin\\theta = ${frac(sinNum, c)}$ and $\\theta$ is in Quadrant ${quadName}, find $\\cos 2\\theta$. Enter a fraction like 7/25 or -7/25.`,
    answerType: "numeric",
    numericAnswer: val / (c * c),
    answerDisplay: `$${frac(val, c * c)}$`,
    hints: [
      `Use the form that needs only sine: $\\cos 2\\theta = 1 - 2\\sin^2\\theta$.`,
      `$\\cos 2\\theta = 1 - 2\\left(${frac(sinNum, c)}\\right)^2 = 1 - \\dfrac{${2 * sinNum * sinNum}}{${c * c}}$.`,
    ],
    explanation: `$\\cos 2\\theta = 1 - 2\\sin^2\\theta = 1 - \\dfrac{${2 * sinNum * sinNum}}{${c * c}} = ${frac(val, c * c)}$. (The quadrant doesn't matter here because sine is squared.)`,
  };
};

const halfAngleFormula: Generator = (): Problem => {
  const items: { prompt: string; correct: string; distractors: { label: string; misconception: string }[]; explanation: string }[] = [
    {
      prompt: "Using a half-angle formula, find the exact value of $\\cos(15^\\circ)$.",
      correct: "$\\dfrac{\\sqrt{2+\\sqrt{3}}}{2}$",
      distractors: [
        { label: "$\\dfrac{\\sqrt{2-\\sqrt{3}}}{2}$", misconception: "That's $\\sin(15^\\circ)$ — cosine's half-angle uses $1 + \\cos\\theta$." },
        { label: "$-\\dfrac{\\sqrt{2+\\sqrt{3}}}{2}$", misconception: "$15^\\circ$ lands in Quadrant I, so its cosine is positive." },
        { label: "$\\dfrac{2+\\sqrt{3}}{4}$", misconception: "Don't drop the outer square root: $\\sqrt{\\frac{1+\\cos 30^\\circ}{2}}$ stays a radical." },
      ],
      explanation: "$\\cos 15^\\circ = \\sqrt{\\frac{1+\\cos 30^\\circ}{2}} = \\sqrt{\\frac{2+\\sqrt3}{4}} = \\frac{\\sqrt{2+\\sqrt3}}{2}$, positive because $15^\\circ$ is in Quadrant I.",
    },
    {
      prompt: "Using a half-angle formula, find the exact value of $\\sin(15^\\circ)$.",
      correct: "$\\dfrac{\\sqrt{2-\\sqrt{3}}}{2}$",
      distractors: [
        { label: "$\\dfrac{\\sqrt{2+\\sqrt{3}}}{2}$", misconception: "That's $\\cos(15^\\circ)$ — sine's half-angle uses $1 - \\cos\\theta$." },
        { label: "$-\\dfrac{\\sqrt{2-\\sqrt{3}}}{2}$", misconception: "$15^\\circ$ lands in Quadrant I, so its sine is positive." },
        { label: "$\\dfrac{2-\\sqrt{3}}{4}$", misconception: "Don't drop the outer square root: $\\sqrt{\\frac{1-\\cos 30^\\circ}{2}}$ stays a radical." },
      ],
      explanation: "$\\sin 15^\\circ = \\sqrt{\\frac{1-\\cos 30^\\circ}{2}} = \\sqrt{\\frac{2-\\sqrt3}{4}} = \\frac{\\sqrt{2-\\sqrt3}}{2}$, positive because $15^\\circ$ is in Quadrant I.",
    },
    {
      prompt: "Using a half-angle formula, find the exact value of $\\sin(22.5^\\circ)$.",
      correct: "$\\dfrac{\\sqrt{2-\\sqrt{2}}}{2}$",
      distractors: [
        { label: "$\\dfrac{\\sqrt{2+\\sqrt{2}}}{2}$", misconception: "That's $\\cos(22.5^\\circ)$ — sine's half-angle uses $1 - \\cos\\theta$." },
        { label: "$\\dfrac{\\sqrt{2}}{4}$", misconception: "Work through $\\sqrt{\\frac{1-\\cos 45^\\circ}{2}}$ carefully — the nested radical survives." },
        { label: "$-\\dfrac{\\sqrt{2-\\sqrt{2}}}{2}$", misconception: "$22.5^\\circ$ lands in Quadrant I, so its sine is positive." },
      ],
      explanation: "$\\sin 22.5^\\circ = \\sqrt{\\frac{1-\\cos 45^\\circ}{2}} = \\sqrt{\\frac{2-\\sqrt2}{4}} = \\frac{\\sqrt{2-\\sqrt2}}{2}$.",
    },
    {
      prompt: "Which formula gives $\\tan\\dfrac{\\theta}{2}$ without a $\\pm$ sign choice?",
      correct: "$\\dfrac{1-\\cos\\theta}{\\sin\\theta}$",
      distractors: [
        { label: "$\\pm\\sqrt{\\dfrac{1-\\cos\\theta}{2}}$", misconception: "That's the sine half-angle formula; the tangent form avoids the radical entirely." },
        { label: "$\\dfrac{\\sin\\theta}{1-\\cos\\theta}$", misconception: "The numerator and denominator are flipped — check with $\\theta = 90^\\circ$." },
        { label: "$\\dfrac{2\\tan\\theta}{1-\\tan^2\\theta}$", misconception: "That's the double-angle formula for tangent, going the other direction." },
      ],
      explanation: "$\\tan\\frac{\\theta}{2} = \\frac{1-\\cos\\theta}{\\sin\\theta} = \\frac{\\sin\\theta}{1+\\cos\\theta}$ — the sign comes out automatically.",
    },
  ];
  const q = pick(items);
  return {
    prompt: q.prompt,
    answerType: "multiple-choice",
    choices: mc(q.correct, q.distractors),
    hints: [
      `Half-angle: $\\sin\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1-\\cos\\theta}{2}}$, $\\cos\\frac{\\theta}{2} = \\pm\\sqrt{\\frac{1+\\cos\\theta}{2}}$.`,
      `Pick the sign from the quadrant where $\\frac{\\theta}{2}$ (not $\\theta$) lands.`,
    ],
    explanation: q.explanation,
  };
};

const verifySolveIdentity: Generator = (): Problem => {
  const items: { prompt: string; correct: string; distractors: { label: string; misconception: string }[]; explanation: string }[] = [
    {
      prompt: "Solve $2\\sin^2\\theta - \\sin\\theta - 1 = 0$ on $[0, 2\\pi)$.",
      correct: "$\\theta = \\dfrac{\\pi}{2},\\ \\dfrac{7\\pi}{6},\\ \\dfrac{11\\pi}{6}$",
      distractors: [
        { label: "$\\theta = \\dfrac{\\pi}{2},\\ \\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6}$", misconception: "$\\sin\\theta = -\\frac{1}{2}$ has solutions in Quadrants III and IV, not I and II." },
        { label: "$\\theta = \\dfrac{\\pi}{2}$", misconception: "The factor $2\\sin\\theta + 1 = 0$ contributes two more solutions." },
        { label: "$\\theta = \\dfrac{7\\pi}{6},\\ \\dfrac{11\\pi}{6}$", misconception: "The factor $\\sin\\theta - 1 = 0$ contributes $\\theta = \\frac{\\pi}{2}$ as well." },
      ],
      explanation: "Factor: $(2\\sin\\theta+1)(\\sin\\theta-1)=0$, so $\\sin\\theta = -\\frac{1}{2}$ (QIII, QIV: $\\frac{7\\pi}{6}, \\frac{11\\pi}{6}$) or $\\sin\\theta = 1$ ($\\frac{\\pi}{2}$).",
    },
    {
      prompt: "Solve $2\\cos^2\\theta - 1 = 0$ on $[0, 2\\pi)$.",
      correct: "$\\theta = \\dfrac{\\pi}{4},\\ \\dfrac{3\\pi}{4},\\ \\dfrac{5\\pi}{4},\\ \\dfrac{7\\pi}{4}$",
      distractors: [
        { label: "$\\theta = \\dfrac{\\pi}{4},\\ \\dfrac{7\\pi}{4}$", misconception: "$\\cos\\theta = -\\frac{\\sqrt2}{2}$ also solves the equation — include Quadrants II and III." },
        { label: "$\\theta = \\dfrac{\\pi}{3},\\ \\dfrac{2\\pi}{3},\\ \\dfrac{4\\pi}{3},\\ \\dfrac{5\\pi}{3}$", misconception: "$\\cos\\theta = \\pm\\frac{\\sqrt2}{2}$ points to $45^\\circ$-family angles, not $60^\\circ$." },
        { label: "$\\theta = \\dfrac{\\pi}{4}$", misconception: "A squared trig equation typically has four solutions on $[0, 2\\pi)$." },
      ],
      explanation: "$\\cos^2\\theta = \\frac{1}{2}$ gives $\\cos\\theta = \\pm\\frac{\\sqrt2}{2}$, hitting all four $45^\\circ$-family angles.",
    },
    {
      prompt: "Solve $\\sin 2\\theta = \\cos\\theta$ on $[0, 2\\pi)$.",
      correct: "$\\theta = \\dfrac{\\pi}{2},\\ \\dfrac{3\\pi}{2},\\ \\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6}$",
      distractors: [
        { label: "$\\theta = \\dfrac{\\pi}{6},\\ \\dfrac{5\\pi}{6}$", misconception: "Don't divide by $\\cos\\theta$ — that discards the solutions where $\\cos\\theta = 0$." },
        { label: "$\\theta = \\dfrac{\\pi}{2},\\ \\dfrac{3\\pi}{2}$", misconception: "The factor $2\\sin\\theta - 1 = 0$ contributes two more solutions." },
        { label: "$\\theta = \\dfrac{\\pi}{3},\\ \\dfrac{2\\pi}{3}$", misconception: "$\\sin\\theta = \\frac{1}{2}$ points to the $30^\\circ$ family, not $60^\\circ$." },
      ],
      explanation: "Use $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta$: $\\cos\\theta(2\\sin\\theta - 1) = 0$, so $\\cos\\theta = 0$ or $\\sin\\theta = \\frac{1}{2}$.",
    },
    {
      prompt: "To verify $\\dfrac{\\sin\\theta}{1-\\cos\\theta} = \\dfrac{1+\\cos\\theta}{\\sin\\theta}$, which is a valid first step?",
      correct: "Multiply $\\dfrac{\\sin\\theta}{1-\\cos\\theta}$ by $\\dfrac{1+\\cos\\theta}{1+\\cos\\theta}$",
      distractors: [
        { label: "Cross-multiply both sides and simplify", misconception: "Verifying an identity means transforming one side — cross-multiplying assumes the identity is already true." },
        { label: "Substitute $\\theta = \\tfrac{\\pi}{4}$ into both sides", misconception: "One value checking out doesn't prove the identity for all $\\theta$." },
        { label: "Add $\\cos\\theta$ to both sides", misconception: "Moving terms across the equals sign assumes what you're trying to prove." },
      ],
      explanation: "Multiplying by the conjugate gives $\\frac{\\sin\\theta(1+\\cos\\theta)}{1-\\cos^2\\theta} = \\frac{\\sin\\theta(1+\\cos\\theta)}{\\sin^2\\theta} = \\frac{1+\\cos\\theta}{\\sin\\theta}$ — one side transformed into the other.",
    },
    {
      prompt: "Simplify $\\dfrac{1 - \\sin^2\\theta}{\\cos\\theta}$.",
      correct: "$\\cos\\theta$",
      distractors: [
        { label: "$\\sec\\theta$", misconception: "The Pythagorean identity puts $\\cos^2\\theta$ on top; one cosine cancels, leaving cosine, not its reciprocal." },
        { label: "$\\sin\\theta$", misconception: "$1 - \\sin^2\\theta$ equals $\\cos^2\\theta$, not $\\sin^2\\theta$." },
        { label: "$1 - \\sin\\theta$", misconception: "$1 - \\sin^2\\theta$ doesn't split as $(1-\\sin\\theta)$ alone — it factors as a difference of squares equal to $\\cos^2\\theta$." },
      ],
      explanation: "$1 - \\sin^2\\theta = \\cos^2\\theta$, so the expression is $\\frac{\\cos^2\\theta}{\\cos\\theta} = \\cos\\theta$.",
    },
    {
      prompt: "Simplify $\\sec^2\\theta - \\tan^2\\theta$.",
      correct: "$1$",
      distractors: [
        { label: "$\\sec\\theta\\tan\\theta$", misconception: "This is a direct Pythagorean identity, not a product: $1 + \\tan^2\\theta = \\sec^2\\theta$." },
        { label: "$\\cos^2\\theta$", misconception: "Rearranging $1 + \\tan^2\\theta = \\sec^2\\theta$ leaves exactly $1$." },
        { label: "$\\sin^2\\theta$", misconception: "Rearranging $1 + \\tan^2\\theta = \\sec^2\\theta$ leaves exactly $1$." },
      ],
      explanation: "From $1 + \\tan^2\\theta = \\sec^2\\theta$: $\\sec^2\\theta - \\tan^2\\theta = 1$.",
    },
  ];
  const q = pick(items);
  return {
    prompt: q.prompt,
    answerType: "multiple-choice",
    choices: mc(q.correct, q.distractors),
    hints: [
      `Rewrite in sine and cosine, look for a Pythagorean identity, and factor like a quadratic when possible.`,
      `When solving, never divide by a trig factor that could be zero — factor it out instead.`,
    ],
    explanation: q.explanation,
  };
};

// ================= UNIT 4 — Vectors / Parametric / Polar =================

const vectorMagnitude: Generator = (): Problem => {
  // pythagorean-friendly pairs
  const pairs = [
    [3, 4],
    [6, 8],
    [5, 12],
    [8, 15],
    [9, 12],
  ];
  const [a, b] = pick(pairs);
  const sa = pick([1, -1]) * a,
    sb = pick([1, -1]) * b;
  const mag = Math.sqrt(sa * sa + sb * sb);
  return {
    prompt: `Find the magnitude of the vector $\\langle ${sa}, ${sb} \\rangle$.`,
    answerType: "numeric",
    numericAnswer: mag,
    answerDisplay: `${mag}`,
    hints: [
      `$\\|\\langle a,b\\rangle\\| = \\sqrt{a^2 + b^2}$.`,
      `$\\sqrt{${sa * sa} + ${sb * sb}} = \\sqrt{${sa * sa + sb * sb}}$.`,
    ],
    explanation: `$\\sqrt{(${sa})^2 + (${sb})^2} = \\sqrt{${sa * sa + sb * sb}} = ${mag}$.`,
  };
};

const vectorAdd: Generator = (): Problem => {
  const vec = (x: number, y: number) => `$\\langle ${x}, ${y} \\rangle$`;
  let a = 0, b = 0, c = 0, d = 0;
  let success = false;
  // retry until the correct answer and all three distractors are distinct
  for (let t = 0; t < 100; t++) {
    a = nz(-4, 4); b = nz(-4, 4); c = nz(-4, 4); d = nz(-4, 4);
    const labels = [
      vec(a + c, b + d), vec(a - c, b - d), vec(a + d, b + c), vec(a * c, b * d),
    ];
    if (new Set(labels).size === 4) { success = true; break; }
  }
  if (!success) throw new Error("vectorAdd: failed to generate distinct choices after 100 retries");

  const correct = `$\\langle ${a + c}, ${b + d} \\rangle$`;
  return {
    prompt: `Compute  $\\langle ${a}, ${b} \\rangle + \\langle ${c}, ${d} \\rangle$.`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$\\langle ${a - c}, ${b - d} \\rangle$`,
        misconception: "Subtracted the components instead of adding them.",
      },
      {
        label: `$\\langle ${a + d}, ${b + c} \\rangle$`,
        misconception: "Cross-added components — add x to x and y to y.",
      },
      {
        label: `$\\langle ${a * c}, ${b * d} \\rangle$`,
        misconception: "Multiplied the components; vector addition adds matching components.",
      },
    ]),
    hints: [`Add the x-components, then the y-components, separately.`],
    explanation: `$\\langle ${a}{+}${c}, ${b}{+}${d} \\rangle = \\langle ${a + c}, ${b + d} \\rangle$.`,
  };
};

// ================= UNIT 5 — Systems / Matrices =================

const determinant2x2: Generator = (): Problem => {
  const a = nz(-5, 5),
    b = ri(-5, 5),
    c = ri(-5, 5),
    d = nz(-5, 5);
  const det = a * d - b * c;
  return {
    prompt: `Find the determinant of $\\begin{bmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{bmatrix}$.`,
    answerType: "numeric",
    numericAnswer: det,
    answerDisplay: `${det}`,
    hints: [
      `For $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$, determinant $= ad - bc$.`,
      `$= (${a})(${d}) - (${b})(${c})$.`,
    ],
    explanation: `$ad - bc = (${a})(${d}) - (${b})(${c}) = ${a * d} - ${b * c} = ${det}$.`,
  };
};

const solveSystem: Generator = (): Problem => {
  // x + y = s ;  x - y = d  -> x = (s+d)/2
  const x = ri(-4, 4),
    y = ri(-4, 4);
  const s = x + y,
    d = x - y;
  return {
    prompt: `Solve the system for $x$:  $\\begin{cases} x + y = ${s} \\\\ x - y = ${d} \\end{cases}$`,
    answerType: "numeric",
    numericAnswer: x,
    answerDisplay: `${x}`,
    hints: [
      `Add the two equations to eliminate $y$.`,
      `$2x = ${s} + (${d})$.`,
    ],
    explanation: `Adding: $2x = ${s + d}$, so $x = ${x}$ (and $y = ${y}$).`,
  };
};

// ================= UNIT 6 — Discrete Math =================

const factorialEval: Generator = (): Problem => {
  const n = ri(3, 6);
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return {
    prompt: `Evaluate  $${n}!$.`,
    answerType: "numeric",
    numericAnswer: f,
    answerDisplay: `${f}`,
    hints: [`$${n}! = ${n}\\times(${n}-1)\\times\\cdots\\times 1$.`],
    explanation: `$${n}! = ${f}$.`,
  };
};

const combinations: Generator = (): Problem => {
  const n = ri(4, 7);
  const r = ri(2, n - 1);
  const C = (n: number, r: number) => {
    let num = 1,
      den = 1;
    for (let i = 0; i < r; i++) {
      num *= n - i;
      den *= i + 1;
    }
    return num / den;
  };
  const val = C(n, r);
  const perm = (() => {
    let p = 1;
    for (let i = 0; i < r; i++) p *= n - i;
    return p;
  })();
  return {
    prompt: `How many ways to choose $${r}$ items from $${n}$ (order does not matter)? Compute $\\binom{${n}}{${r}}$.`,
    answerType: "numeric",
    numericAnswer: val,
    answerDisplay: `${val}`,
    hints: [
      `$\\binom{n}{r} = \\dfrac{n!}{r!\\,(n-r)!}$.`,
      `Compute the product of $r$ terms over $r!$.`,
    ],
    explanation: `$\\binom{${n}}{${r}} = ${val}$. (If order mattered it would be $${perm}$.)`,
  };
};

const arithmeticSeries: Generator = (): Problem => {
  const a1 = ri(1, 5),
    dd = ri(1, 4),
    n = ri(4, 8);
  const an = a1 + (n - 1) * dd;
  const sum = (n * (a1 + an)) / 2;
  return {
    prompt: `An arithmetic sequence starts at $${a1}$ with common difference $${dd}$. Find the sum of the first $${n}$ terms.`,
    answerType: "numeric",
    numericAnswer: sum,
    answerDisplay: `${sum}`,
    hints: [
      `Last term: $a_n = a_1 + (n-1)d = ${an}$.`,
      `Sum $= \\dfrac{n(a_1 + a_n)}{2}$.`,
    ],
    explanation: `$a_{${n}} = ${an}$, so sum $= \\dfrac{${n}(${a1} + ${an})}{2} = ${sum}$.`,
  };
};

// ================= UNIT 7 — Analytic Geometry =================

const distanceFormula: Generator = (): Problem => {
  const pairs = [
    [3, 4],
    [6, 8],
    [5, 12],
    [8, 15],
  ];
  const [dx, dy] = pick(pairs);
  const x1 = ri(-3, 3),
    y1 = ri(-3, 3);
  const x2 = x1 + dx,
    y2 = y1 + dy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return {
    prompt: `Find the distance between $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
    answerType: "numeric",
    numericAnswer: dist,
    answerDisplay: `${dist}`,
    hints: [
      `$d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$.`,
      `$= \\sqrt{${dx}^2 + ${dy}^2}$.`,
    ],
    explanation: `$\\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${dx * dx + dy * dy}} = ${dist}$.`,
  };
};

const circleEquation: Generator = (): Problem => {
  const h = nz(-4, 4);
  let k = nz(-4, 4);
  // |h| != |k| keeps the sign-flip and swapped-center distractors distinct
  while (abs(k) === abs(h)) k = nz(-4, 4);
  const r = ri(2, 6);
  const correct = `$(x ${sign(-h)} ${abs(h)})^2 + (y ${sign(-k)} ${abs(k)})^2 = ${r * r}$`;
  return {
    prompt: `Write the equation of a circle with center $(${h}, ${k})$ and radius $${r}$.`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$(x ${sign(h)} ${abs(h)})^2 + (y ${sign(k)} ${abs(k)})^2 = ${r * r}$`,
        misconception: "The center signs flip inside the squares: center (h,k) → (x − h), (y − k).",
      },
      {
        label: `$(x ${sign(-h)} ${abs(h)})^2 + (y ${sign(-k)} ${abs(k)})^2 = ${r}$`,
        misconception: "The right side is r², not r.",
      },
      {
        label: `$(x ${sign(-k)} ${abs(k)})^2 + (y ${sign(-h)} ${abs(h)})^2 = ${r * r}$`,
        misconception: "Swapped h and k — h goes with x, k goes with y.",
      },
    ]),
    hints: [
      `Standard form: $(x-h)^2 + (y-k)^2 = r^2$.`,
      `Substitute the center and square the radius.`,
    ],
    explanation: `Center $(${h},${k})$, radius $${r}$: ${correct}.`,
  };
};

// ================= UNIT 8 — Calculus Intro =================

const limitDirect: Generator = (): Problem => {
  const a = nz(2, 4),
    b = ri(-5, 5),
    c = ri(1, 4);
  const val = a * c * c + b; // f(x) = a x^2 + b at x = c
  return {
    prompt: `Evaluate the limit  $\\displaystyle\\lim_{x \\to ${c}} \\left(${a}x^2 ${sign(b)} ${abs(b)}\\right)$.`,
    answerType: "numeric",
    numericAnswer: val,
    answerDisplay: `${val}`,
    hints: [
      `This polynomial is continuous, so substitute $x = ${c}$ directly.`,
      `$${a}(${c})^2 ${sign(b)} ${abs(b)}$.`,
    ],
    explanation: `By direct substitution, $${a}(${c})^2 ${sign(b)} ${abs(b)} = ${val}$.`,
  };
};

const powerRuleDerivative: Generator = (): Problem => {
  const a = nz(2, 5),
    n = ri(2, 5);
  const dCoef = a * n;
  const dPow = n - 1;
  const correct = `$${dCoef}x^{${dPow}}$`;
  return {
    prompt: `Differentiate  $f(x) = ${a}x^{${n}}$  using the power rule.`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$${a}x^{${dPow}}$`,
        misconception: "Forgot to multiply by the exponent: bring down the power first.",
      },
      {
        label: `$${dCoef}x^{${n}}$`,
        misconception: "Forgot to subtract 1 from the exponent.",
      },
      {
        label: `$${a * n}x^{${n + 1}}$`,
        misconception: "Added 1 to the exponent (that's integration, not differentiation).",
      },
    ]),
    hints: [
      `Power rule: $\\dfrac{d}{dx}(ax^n) = a\\,n\\,x^{n-1}$.`,
      `Bring the exponent down, then reduce the power by 1.`,
    ],
    explanation: `$\\dfrac{d}{dx}(${a}x^{${n}}) = ${a}\\cdot${n}\\,x^{${n}-1} = ${dCoef}x^{${dPow}}$.`,
  };
};

const tangentSlope: Generator = (): Problem => {
  // f(x) = a x^2, f'(x) = 2a x, slope at x = c
  const a = nz(1, 3),
    c = ri(1, 4);
  const slope = 2 * a * c;
  return {
    prompt: `For $f(x) = ${a}x^2$, find the slope of the tangent line at $x = ${c}$.`,
    answerType: "numeric",
    numericAnswer: slope,
    answerDisplay: `${slope}`,
    hints: [
      `The slope of the tangent is $f'(x)$.`,
      `$f'(x) = ${2 * a}x$; evaluate at $x = ${c}$.`,
    ],
    explanation: `$f'(x) = ${2 * a}x$, so $f'(${c}) = ${slope}$.`,
  };
};

// ================= UNIT 9 — Differentiation Deeper =================

const limitByFactoring: Generator = (): Problem => {
  const r = nz(-3, 3);
  let s = nz(-3, 3);
  while (s === r) s = nz(-3, 3);
  // numerator = (x - r)(x - s) = x^2 - (r+s)x + rs ; limit at x->r is (r - s)
  const B = -(r + s),
    C = r * s;
  const ans = r - s;
  const num = `x^{2}${term(B, "x", 1, false)}${term(C, "x", 0, false)}`;
  const den = `x ${term(-r, "x", 0, false)}`;
  return {
    prompt: `Evaluate  $\\displaystyle\\lim_{x \\to ${r}} \\dfrac{${num}}{${den}}$.  (Direct substitution gives $0/0$ — factor first.)`,
    answerType: "numeric",
    numericAnswer: ans,
    answerDisplay: `${ans}`,
    hints: [
      `Substituting $x=${r}$ gives $0/0$, so the factor $(x ${term(-r, "x", 0, false)})$ must cancel.`,
      `The numerator factors as $(x ${term(-r, "x", 0, false)})(x ${term(-s, "x", 0, false)})$.`,
    ],
    explanation: `$\\dfrac{(x ${term(-r, "x", 0, false)})(x ${term(-s, "x", 0, false)})}{x ${term(-r, "x", 0, false)}} = x ${term(-s, "x", 0, false)}$; at $x=${r}$ this is $${ans}$.`,
  };
};

const derivativePolynomial: Generator = (): Problem => {
  const a = nz(1, 4),
    b = nz(-5, 5),
    c = nz(-6, 6);
  // f = a x^2 + b x + c  ->  f' = 2a x + b
  const da = 2 * a;
  const fStr = `${term(a, "x", 2, true)}${term(b, "x", 1, false)}${term(c, "x", 0, false)}`;
  const correct = `$${term(da, "x", 1, true)}${term(b, "x", 0, false)}$`;
  return {
    prompt: `Differentiate  $f(x) = ${fStr}$  (sum/difference rule).`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$${term(da, "x", 1, true)}${term(b, "x", 0, false)}${term(c, "x", 0, false)}$`,
        misconception: "The derivative of a constant is 0 — the $" + c + "$ should disappear, not stay.",
      },
      {
        label: `$${term(a, "x", 1, true)}${term(b, "x", 0, false)}$`,
        misconception: "Forgot to bring the exponent 2 down as a factor on the $x^2$ term.",
      },
      {
        label: `$${term(da, "x", 1, true)}$`,
        misconception: "Dropped the $bx$ term — the derivative of $" + b + "x$ is $" + b + "$, not 0.",
      },
    ]),
    hints: [
      `Differentiate each term separately and add the results.`,
      `Power rule on each: $\\tfrac{d}{dx}(ax^n)=an\\,x^{n-1}$; a constant goes to 0.`,
    ],
    explanation: `$f'(x) = ${da}x ${sign(b)} ${abs(b)}$ (the constant $${c}$ differentiates to 0).`,
  };
};

const productRule: Generator = (): Problem => {
  const a = nz(-4, 4);
  let b = nz(-4, 4);
  while (b === a) b = nz(-4, 4); // a != b guarantees sum (a+b) != product (a*b)
  // f = (x+a)(x+b) -> f' = 2x + (a+b)
  const sum = a + b,
    prod = a * b;
  const inner1 = `x ${term(a, "x", 0, false)}`;
  const inner2 = `x ${term(b, "x", 0, false)}`;
  const correct = `$2x ${term(sum, "x", 0, false)}$`;
  return {
    prompt: `Use the product rule to differentiate  $f(x) = (${inner1})(${inner2})$.`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$1$`,
        misconception: "The derivative of a product is NOT the product of the derivatives ($1\\cdot 1$).",
      },
      {
        label: `$2x ${term(prod, "x", 0, false)}$`,
        misconception: "Used the product of the constants; the product rule gives a SUM of two terms.",
      },
      {
        label: `$x ${term(sum, "x", 0, false)}$`,
        misconception: "Forgot the coefficient 2 — each of the two product-rule terms contributes an $x$.",
      },
    ]),
    hints: [
      `Product rule: $(uv)' = u'v + uv'$ with $u = ${inner1}$, $v = ${inner2}$.`,
      `$= (1)(${inner2}) + (${inner1})(1)$, then combine like terms.`,
    ],
    explanation: `$(1)(${inner2}) + (${inner1})(1) = 2x ${sign(sum)} ${abs(sum)}$.`,
  };
};

const quotientRule: Generator = (): Problem => {
  const a = nz(-4, 4);
  let b = nz(-4, 4);
  while (b === a) b = nz(-4, 4);
  // f = (x+a)/(x+b) -> f' = (b - a)/(x+b)^2
  const k = b - a;
  const inner = `x ${term(b, "x", 0, false)}`;
  const correct = `$\\dfrac{${k}}{(${inner})^2}$`;
  return {
    prompt: `Use the quotient rule to differentiate  $f(x) = \\dfrac{x ${term(a, "x", 0, false)}}{${inner}}$.`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$\\dfrac{${-k}}{(${inner})^2}$`,
        misconception: "Sign/order error: the quotient rule is $(g'h - gh')$ — the order of subtraction matters.",
      },
      {
        label: `$\\dfrac{${k}}{${inner}}$`,
        misconception: "Forgot to square the denominator — the quotient rule divides by $h^2$.",
      },
      {
        label: `$1$`,
        misconception: "The derivative of a quotient is NOT the quotient of the derivatives.",
      },
    ]),
    hints: [
      `Quotient rule: $\\left(\\dfrac{g}{h}\\right)' = \\dfrac{g'h - gh'}{h^2}$.`,
      `Here $g' = 1$ and $h' = 1$, so the numerator is $(${inner}) - (x ${term(a, "x", 0, false)})$.`,
    ],
    explanation: `Numerator: $(${inner}) - (x ${term(a, "x", 0, false)}) = ${k}$; over $h^2$: $\\dfrac{${k}}{(${inner})^2}$.`,
  };
};

const chainRule: Generator = (): Problem => {
  const a = nz(2, 4),
    b = nz(-4, 4),
    n = pick([2, 3, 4].filter((v) => v !== a)); // n != a so the two distractors differ
  // f = (a x + b)^n -> f' = a n (a x + b)^{n-1}
  const coef = a * n;
  const inner = `${term(a, "x", 1, true)}${term(b, "x", 0, false)}`;
  const correct = `$${coef}(${inner})^{${n - 1}}$`;
  return {
    prompt: `Use the chain rule to differentiate  $f(x) = (${inner})^{${n}}$.`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$${n}(${inner})^{${n - 1}}$`,
        misconception: "Forgot the inner derivative — multiply by $" + a + "$ (the derivative of the inside).",
      },
      {
        label: `$${coef}(${inner})^{${n}}$`,
        misconception: "Forgot to reduce the power by 1.",
      },
      {
        label: `$${a}(${inner})^{${n - 1}}$`,
        misconception: "Forgot to bring the exponent $" + n + "$ down as a factor.",
      },
    ]),
    hints: [
      `Chain rule: differentiate the outside, keep the inside, then times the inside's derivative.`,
      `Outside: $${n}(\\,\\cdot\\,)^{${n - 1}}$; inside derivative: $\\tfrac{d}{dx}(${inner}) = ${a}$.`,
    ],
    explanation: `$${n}(${inner})^{${n - 1}} \\cdot ${a} = ${coef}(${inner})^{${n - 1}}$.`,
  };
};

// ================= UNIT 10 — Applications of Derivatives =================

const increasingInterval: Generator = (): Problem => {
  const p = nz(-4, 4); // critical x
  // f(x) = x^2 - 2p x  ->  f'(x) = 2x - 2p = 2(x - p); increasing for x > p
  const fStr = `x^{2}${term(-2 * p, "x", 1, false)}`;
  const correct = `$x > ${p}$`;
  return {
    prompt: `For $f(x) = ${fStr}$, on which interval is $f$ increasing?`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$x < ${p}$`,
        misconception: "That's where $f$ is decreasing — $f$ increases where $f'(x) > 0$.",
      },
      {
        label: `$x > ${-p}$`,
        misconception: `Sign slip on the critical point: solve $2x - 2(${p}) = 0$ to get $x = ${p}$.`,
      },
      {
        label: `all real $x$`,
        misconception: "A parabola turns around at its vertex, so it isn't increasing everywhere.",
      },
    ]),
    hints: [
      `$f$ is increasing wherever $f'(x) > 0$.`,
      `$f'(x) = 2x - 2(${p})$; solve $f'(x) > 0$.`,
    ],
    explanation: `$f'(x) = 2(x - ${p})$, which is positive when $x > ${p}$.`,
  };
};

const criticalPointQuad: Generator = (): Problem => {
  const m = nz(-4, 4);
  const b = 2 * m; // even so the critical point is an integer
  const c = ri(-5, 5);
  // f(x) = x^2 + b x + c  ->  f'(x) = 2x + b = 0  ->  x = -m
  const ans = -m;
  const fStr = `x^{2}${term(b, "x", 1, false)}${term(c, "x", 0, false)}`;
  return {
    prompt: `Find the $x$-value of the critical point of $f(x) = ${fStr}$.`,
    answerType: "numeric",
    numericAnswer: ans,
    answerDisplay: `${ans}`,
    hints: [
      `Critical points occur where $f'(x) = 0$.`,
      `$f'(x) = 2x ${sign(b)} ${abs(b)}$; set it equal to 0.`,
    ],
    explanation: `$f'(x) = 2x ${sign(b)} ${abs(b)} = 0 \\Rightarrow x = ${ans}$.`,
  };
};

const maxOrMin: Generator = (): Problem => {
  const a = nz(-3, 3);
  const b = 2 * nz(-3, 3);
  const c = ri(-4, 4);
  const fStr = `${term(a, "x", 2, true)}${term(b, "x", 1, false)}${term(c, "x", 0, false)}`;
  const correct =
    a > 0
      ? "A local minimum (parabola opens up)"
      : "A local maximum (parabola opens down)";
  const opposite =
    a > 0
      ? "A local maximum (parabola opens down)"
      : "A local minimum (parabola opens up)";
  return {
    prompt: `Does $f(x) = ${fStr}$ have a local maximum or a local minimum at its critical point?`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: opposite,
        misconception: "The sign of the $x^2$ coefficient decides: positive opens up (min), negative opens down (max).",
      },
      {
        label: "Neither — it is a straight line",
        misconception: "It has an $x^2$ term, so it's a parabola with one turning point.",
      },
      {
        label: "It has both a max and a min",
        misconception: "A parabola has exactly one turning point, not two.",
      },
    ]),
    hints: [
      `Look at the sign of the $x^2$ coefficient.`,
      `Positive → opens upward → the vertex is a minimum.`,
    ],
    explanation: `The leading coefficient is ${a > 0 ? "positive" : "negative"}, so the parabola opens ${a > 0 ? "up → minimum" : "down → maximum"}.`,
  };
};

const concavityCubic: Generator = (): Problem => {
  const a = nz(-3, 3);
  // f(x) = a x^3  ->  f''(x) = 6a x ; concave up where 6a x > 0
  const fStr = `${term(a, "x", 3, true)}`;
  const correct = a > 0 ? "$x > 0$" : "$x < 0$";
  const opposite = a > 0 ? "$x < 0$" : "$x > 0$";
  return {
    prompt: `On what interval is $f(x) = ${fStr}$ concave up?`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: opposite,
        misconception: `Concave up means $f''(x) > 0$; with $f''(x) = ${6 * a}x$, recheck the sign.`,
      },
      {
        label: "all real $x$",
        misconception: "A cubic switches concavity at its inflection point (here $x = 0$).",
      },
      {
        label: "never concave up",
        misconception: `$f''(x) = ${6 * a}x$ is positive on one side of $0$.`,
      },
    ]),
    hints: [
      `Concave up where the second derivative $f''(x) > 0$.`,
      `$f''(x) = ${6 * a}x$; solve $> 0$.`,
    ],
    explanation: `$f''(x) = ${6 * a}x > 0$ when ${correct} (inflection point at $x = 0$).`,
  };
};

const optimizeRectangle: Generator = (): Problem => {
  const P = 4 * ri(2, 8); // perimeter, multiple of 4 -> integer answer
  const half = P / 2;
  const ans = P / 4;
  return {
    prompt: `A rectangle has a fixed perimeter of $${P}$. What width maximizes its area?`,
    answerType: "numeric",
    numericAnswer: ans,
    answerDisplay: `${ans}`,
    hints: [
      `If the width is $w$, the length is $${half} - w$, so area $A(w) = w(${half} - w)$.`,
      `Maximize by setting $A'(w) = 0$.`,
    ],
    explanation: `$A(w) = w(${half} - w)$, so $A'(w) = ${half} - 2w = 0 \\Rightarrow w = ${ans}$ (a square).`,
  };
};

// ================= UNIT 11 — Integration Intro =================

function coefStr(k: number): string {
  return k === 1 ? "" : k === -1 ? "-" : `${k}`;
}

const antiderivativePower: Generator = (): Problem => {
  const n = ri(1, 4);
  const k = nz(1, 4);
  const a = k * (n + 1); // so a/(n+1) = k is an integer
  const fStr = `${coefStr(a)}x^{${n}}`;
  const correct = `$${coefStr(k)}x^{${n + 1}} + C$`;
  return {
    prompt: `Find  $\\displaystyle\\int ${fStr}\\,dx$.`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$${coefStr(a)}x^{${n + 1}} + C$`,
        misconception: `After raising the power, divide by the new exponent (${n + 1}).`,
      },
      {
        label: `$${coefStr(a * n)}x^{${n - 1}} + C$`,
        misconception: "That's differentiation — to integrate, ADD 1 to the exponent.",
      },
      {
        label: `$${coefStr(k)}x^{${n + 1}}$`,
        misconception: "An indefinite integral needs the constant of integration, $+ C$.",
      },
    ]),
    hints: [
      `Reverse the power rule: add 1 to the exponent, then divide by the new exponent.`,
      `$\\int ax^n\\,dx = \\dfrac{a}{n+1}x^{n+1} + C$. Don't forget $+C$.`,
    ],
    explanation: `$\\int ${fStr}\\,dx = \\dfrac{${a}}{${n + 1}}x^{${n + 1}} + C = ${coefStr(k)}x^{${n + 1}} + C$.`,
  };
};

const integratePolynomial: Generator = (): Problem => {
  const a = 2 * nz(1, 3); // even so a/2 is an integer
  const b = nz(-5, 5);
  const half = a / 2;
  const fStr = `${term(a, "x", 1, true)}${term(b, "x", 0, false)}`;
  const correct = `$${coefStr(half)}x^{2}${term(b, "x", 1, false)} + C$`;
  return {
    prompt: `Find  $\\displaystyle\\int (${fStr})\\,dx$.`,
    answerType: "multiple-choice",
    choices: mc(correct, [
      {
        label: `$${coefStr(a)}x^{2}${term(b, "x", 1, false)} + C$`,
        misconception: "Integrating $x$ gives $\\tfrac{1}{2}x^2$ — divide by the new power.",
      },
      {
        label: `$${coefStr(half)}x^{2} + C$`,
        misconception: `$\\int ${b} \\, dx = ${b}x$, not a constant — the ${b} becomes ${b}x.`,
      },
      {
        label: `$${coefStr(half)}x^{2}${term(b, "x", 1, false)}$`,
        misconception: "An indefinite integral needs $+ C$.",
      },
    ]),
    hints: [
      `Integrate term by term.`,
      `$\\int ax\\,dx = \\tfrac{a}{2}x^2$ and $\\int b\\,dx = bx$.`,
    ],
    explanation: `$\\int (${fStr})\\,dx = ${coefStr(half)}x^{2} ${sign(b)} ${abs(b)}x + C$.`,
  };
};

const definiteIntegral: Generator = (): Problem => {
  const a = nz(1, 4);
  const b = ri(1, 4);
  const coef = 2 * a; // antiderivative is a x^2
  const ans = a * b * b; // [a x^2]_0^b = a b^2
  return {
    prompt: `Evaluate  $\\displaystyle\\int_{0}^{${b}} ${term(coef, "x", 1, true)}\\,dx$.`,
    answerType: "numeric",
    numericAnswer: ans,
    answerDisplay: `${ans}`,
    hints: [
      `Find the antiderivative: $\\int ${coef}x\\,dx = ${a}x^2$.`,
      `Evaluate $${a}x^2$ from $0$ to $${b}$:  $F(${b}) - F(0)$.`,
    ],
    explanation: `$\\left[${a}x^2\\right]_0^{${b}} = ${a}(${b})^2 - 0 = ${ans}$.`,
  };
};

const areaUnderCurve: Generator = (): Problem => {
  const a = nz(1, 4);
  const b = 2 * ri(1, 3); // even so the area is an integer
  const ans = (a * b * b) / 2; // area = ∫_0^b a x dx = a b^2 / 2
  return {
    prompt: `Find the area under $f(x) = ${term(a, "x", 1, true)}$ from $x = 0$ to $x = ${b}$.`,
    answerType: "numeric",
    numericAnswer: ans,
    answerDisplay: `${ans}`,
    hints: [
      `Area $= \\displaystyle\\int_{0}^{${b}} ${term(a, "x", 1, true)}\\,dx$.`,
      `Antiderivative $\\tfrac{${a}}{2}x^2$; evaluate from $0$ to $${b}$.`,
    ],
    explanation: `$\\int_{0}^{${b}} ${term(a, "x", 1, true)}\\,dx = \\left[\\tfrac{${a}}{2}x^2\\right]_0^{${b}} = ${ans}$.`,
  };
};

// ================= UNIT 12 — Applications of Integration =================

const areaBetweenCurves: Generator = (): Problem => {
  const a = nz(1, 3);
  const b = nz(1, 3);
  const upper = 4; // fixed upper bound for simplicity
  // f(x) = ax, g(x) = bx^2; they intersect at x=0 and x=a/b (but we use x=2 for simplicity)
  const x_int = 2;
  // Area = ∫_0^2 (ax - bx^2) dx = a(4) - b(8/3) = 4a - 8b/3
  const ans = 4 * a - (8 * b) / 3;
  return {
    prompt: `Find the area between $f(x) = ${a}x$ and $g(x) = ${b}x^2$ from $x = 0$ to $x = ${x_int}$.`,
    answerType: "numeric",
    numericAnswer: ans,
    answerDisplay: `${ans.toFixed(2)}`,
    hints: [
      `Determine which function is on top: at $x=1$, $f(1)=${a}$ and $g(1)=${b}$.`,
      `Area $= \\displaystyle\\int_{0}^{${x_int}} (${a}x - ${b}x^2)\\,dx$.`,
      `Antiderivative: $${a/2}x^2 - \\tfrac{${b}}{3}x^3$.`,
    ],
    explanation: `$\\int_{0}^{${x_int}} (${a}x - ${b}x^2)\\,dx = \\left[${a/2}x^2 - \\tfrac{${b}}{3}x^3\\right]_0^{${x_int}} = ${ans.toFixed(2)}$.`,
  };
};

const volumeDiskMethod: Generator = (): Problem => {
  const r = nz(1, 3); // radius coefficient
  const h = nz(2, 4); // height
  // V = π ∫_0^h (r)^2 dy = π r^2 h (cylinder)
  const ans_coef = r * r * h; // coefficient before π
  return {
    prompt: `Find the volume of the solid of revolution formed by rotating $f(x) = ${r}$ around the x-axis from $x = 0$ to $x = ${h}$.`,
    answerType: "multiple-choice",
    choices: mc(`$${ans_coef}\\pi$`, [
      {
        label: `$${r * h}\\pi$`,
        misconception: "Volume of revolution requires squaring the radius: $V = \\pi \\int r^2 \\,dx$.",
      },
      {
        label: `$${ans_coef}$`,
        misconception: "The volume includes $\\pi$ because we're rotating around an axis.",
      },
      {
        label: `$${r}\\pi${h}$`,
        misconception: "Square the radius first, then multiply by height and $\\pi$.",
      },
    ]),
    hints: [
      `Disk method: $V = \\pi \\displaystyle\\int_{0}^{${h}} [r(x)]^2\\,dx$.`,
      `Here, $r(x) = ${r}$ (constant), so $V = \\pi \\int_{0}^{${h}} ${r}^2\\,dx = \\pi ${r}^2 \\cdot ${h}$.`,
    ],
    explanation: `$V = \\pi \\int_{0}^{${h}} ${r}^2\\,dx = \\pi ${r}^2 [x]_0^{${h}} = ${ans_coef}\\pi$.`,
  };
};

const netChangeFunction: Generator = (): Problem => {
  const v = nz(2, 5); // velocity
  const t_start = ri(0, 2);
  const t_end = t_start + nz(2, 4);
  const disp = v * (t_end - t_start);
  return {
    prompt: `An object moves with constant velocity $v(t) = ${v}$ m/s from $t = ${t_start}$ to $t = ${t_end}$ seconds. What is the displacement?`,
    answerType: "numeric",
    numericAnswer: disp,
    answerDisplay: `${disp} \\text{ m}`,
    hints: [
      `Displacement $= \\displaystyle\\int_{${t_start}}^{${t_end}} v(t)\\,dt$.`,
      `$= \\displaystyle\\int_{${t_start}}^{${t_end}} ${v}\\,dt = ${v}[t]_{${t_start}}^{${t_end}}$.`,
    ],
    explanation: `Displacement $= ${v}(${t_end} - ${t_start}) = ${v} \\cdot ${t_end - t_start} = ${disp}$ m.`,
  };
};

const accumulationProblem: Generator = (): Problem => {
  const r = nz(2, 4); // rate in units per minute
  const t = nz(2, 5); // time in minutes
  const total = r * t;
  return {
    prompt: `Water flows into a tank at a constant rate of $${r}$ liters/minute. How much water accumulates from $t = 0$ to $t = ${t}$ minutes?`,
    answerType: "numeric",
    numericAnswer: total,
    answerDisplay: `${total} \\text{ L}`,
    hints: [
      `Total accumulation $= \\displaystyle\\int_{0}^{${t}} r(t)\\,dt$.`,
      `With constant rate, this is $${r} \\times ${t}$.`,
    ],
    explanation: `Accumulation $= \\displaystyle\\int_{0}^{${t}} ${r}\\,dt = ${r} \\cdot ${t} = ${total}$ liters.`,
  };
};

const averageValueFunction: Generator = (): Problem => {
  const a = nz(1, 3);
  const b = nz(1, 3);
  const x_end = 3;
  // f(x) = ax + b; average value = (1/(b-a)) ∫_a^b f(x) dx
  // Let's use [0, 3]: avg = (1/3) ∫_0^3 (ax+b) dx = (1/3)[a(9/2) + 3b] = (1/3)[9a/2 + 3b]
  const integral = (a * x_end * x_end) / 2 + b * x_end; // ∫_0^3 (ax+b) dx
  const avg = integral / x_end;
  return {
    prompt: `Find the average value of $f(x) = ${term(a, "x", 1, true)} ${term(b, "x", 0, false)}$ on $[0, ${x_end}]$.`,
    answerType: "numeric",
    numericAnswer: avg,
    answerDisplay: `${avg.toFixed(2)}`,
    hints: [
      `Average value $= \\dfrac{1}{${x_end}-0} \\displaystyle\\int_{0}^{${x_end}} f(x)\\,dx$.`,
      `Compute: $\\dfrac{1}{${x_end}} \\left[\\tfrac{${a}}{2}x^2 ${term(b, "x", 1, false)}\\right]_0^{${x_end}}$.`,
    ],
    explanation: `Average $= \\dfrac{1}{${x_end}} \\cdot ${integral.toFixed(1)} = ${avg.toFixed(2)}$.`,
  };
};

// ---------- registry ----------
export const GENERATORS: Record<string, Generator> = {
  evaluateFunction,
  slopeFromPoints,
  solveLinear,
  solveQuadraticFactor,
  polynomialEndBehavior,
  zerosAndMultiplicity,
  rationalAsymptote,
  evaluateLog,
  logProperties,
  compoundGrowth,
  degToRad,
  unitCircleValue,
  reciprocalQuotientIdentity,
  pythagoreanIdentity,
  evenOddCofunction,
  sumDifferenceFormula,
  doubleAngleFormula,
  halfAngleFormula,
  verifySolveIdentity,
  vectorMagnitude,
  vectorAdd,
  determinant2x2,
  solveSystem,
  factorialEval,
  combinations,
  arithmeticSeries,
  distanceFormula,
  circleEquation,
  limitDirect,
  powerRuleDerivative,
  tangentSlope,
  limitByFactoring,
  derivativePolynomial,
  productRule,
  quotientRule,
  chainRule,
  increasingInterval,
  criticalPointQuad,
  maxOrMin,
  concavityCubic,
  optimizeRectangle,
  antiderivativePower,
  integratePolynomial,
  definiteIntegral,
  areaUnderCurve,
  areaBetweenCurves,
  volumeDiskMethod,
  netChangeFunction,
  accumulationProblem,
  averageValueFunction,
};

export function generate(name: string): Problem {
  const g = GENERATORS[name];
  if (!g) {
    return {
      prompt: `(missing generator: ${name})`,
      answerType: "numeric",
      numericAnswer: 0,
      hints: [],
      explanation: "",
    };
  }
  return g();
}
