import type { Unit } from "../types";

const unit: Unit = {
  id: "unit-09",
  title: "Differentiation Deeper",
  blurb: "Beyond the power rule: tricky limits, and the product, quotient & chain rules.",
  mcpsStandards: ["Bridge to AP Calculus AB/BC", "Differentiation Rules"],
  requires: "unit-08",
  skills: [
    {
      id: "u09-s01",
      name: "Limits by factoring (0/0)",
      lesson:
        "When direct substitution gives the **indeterminate form $\\frac{0}{0}$**, the limit might still exist — the zero in the denominator usually cancels with a hidden factor in the numerator.\n\nThe strategy: **factor**, cancel the common factor, then substitute. The classic example is the difference quotient, which is exactly this kind of limit.",
      examples: [
        {
          type: "worked",
          prompt: "Evaluate $\\displaystyle\\lim_{x\\to 3}\\frac{x^2-9}{x-3}$.",
          steps: [
            "Substituting $x=3$ gives $0/0$ — indeterminate, so factor.",
            "Numerator: $x^2-9 = (x-3)(x+3)$.",
            "Cancel $(x-3)$: the expression becomes $x+3$.",
            "Now substitute: $3+3 = 6$.",
          ],
          answer: "$6$",
          selfExplain: "Why is it valid to cancel $(x-3)$ even though it equals 0 at $x=3$?",
        },
      ],
      generator: "limitByFactoring",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u09-s02",
      name: "Derivatives of polynomials (sum & difference rule)",
      lesson:
        "The derivative of a sum is the sum of the derivatives, so you can differentiate a polynomial **one term at a time** with the power rule:\n\n$$\\frac{d}{dx}\\big(ax^n + bx^m + \\cdots\\big) = an\\,x^{n-1} + bm\\,x^{m-1} + \\cdots$$\n\nRemember: a **constant term differentiates to 0**, and the derivative of $bx$ is just $b$.",
      examples: [
        {
          type: "worked",
          prompt: "Differentiate $f(x) = 4x^3 - 2x^2 + 5x - 7$.",
          steps: [
            "$\\frac{d}{dx}(4x^3) = 12x^2$.",
            "$\\frac{d}{dx}(-2x^2) = -4x$.",
            "$\\frac{d}{dx}(5x) = 5$; $\\frac{d}{dx}(-7) = 0$.",
            "Combine: $f'(x) = 12x^2 - 4x + 5$.",
          ],
          answer: "$f'(x) = 12x^2 - 4x + 5$",
        },
      ],
      generator: "derivativePolynomial",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u09-s03",
      name: "The product rule",
      lesson:
        "The derivative of a **product is NOT** the product of the derivatives. Instead:\n\n$$(uv)' = u'v + uv'.$$\n\nDifferentiate the first times the second, plus the first times the derivative of the second. Two terms, always added.",
      examples: [
        {
          type: "worked",
          prompt: "Differentiate $f(x) = (x+2)(x+5)$ with the product rule.",
          steps: [
            "Let $u = x+2$, $v = x+5$, so $u' = 1$, $v' = 1$.",
            "$(uv)' = u'v + uv' = (1)(x+5) + (x+2)(1)$.",
            "Combine: $x+5 + x+2 = 2x + 7$.",
          ],
          answer: "$f'(x) = 2x + 7$",
          selfExplain: "Multiply it out first, then differentiate — do you get the same answer? Why must you?",
        },
      ],
      generator: "productRule",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u09-s04",
      name: "The quotient rule",
      lesson:
        "For a fraction of functions, use the quotient rule (mind the **order** and the **square**):\n\n$$\\left(\\frac{g}{h}\\right)' = \\frac{g'h - gh'}{h^2}.$$\n\nA memory aid: \"low d-high minus high d-low, over the square of what's below.\" The subtraction order matters — swapping it flips the sign.",
      examples: [
        {
          type: "worked",
          prompt: "Differentiate $f(x) = \\dfrac{x+1}{x+4}$.",
          steps: [
            "$g = x+1,\\ h = x+4$, so $g'=1,\\ h'=1$.",
            "Numerator: $g'h - gh' = (1)(x+4) - (x+1)(1)$.",
            "$= (x+4) - (x+1) = 3$.",
            "Over $h^2$: $f'(x) = \\dfrac{3}{(x+4)^2}$.",
          ],
          answer: "$f'(x) = \\dfrac{3}{(x+4)^2}$",
        },
      ],
      generator: "quotientRule",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
    {
      id: "u09-s05",
      name: "The chain rule",
      lesson:
        "The chain rule differentiates a **function inside a function** (a composition):\n\n$$\\frac{d}{dx}\\,f\\big(g(x)\\big) = f'\\big(g(x)\\big)\\cdot g'(x).$$\n\nDifferentiate the outside (leaving the inside alone), then **multiply by the derivative of the inside**. Forgetting that last factor is the most common mistake in all of calculus.",
      examples: [
        {
          type: "worked",
          prompt: "Differentiate $f(x) = (3x+1)^4$.",
          steps: [
            "Outside is $(\\,\\cdot\\,)^4$; its derivative is $4(\\,\\cdot\\,)^3$, keeping the inside.",
            "So far: $4(3x+1)^3$.",
            "Inside derivative: $\\frac{d}{dx}(3x+1) = 3$.",
            "Multiply: $4(3x+1)^3 \\cdot 3 = 12(3x+1)^3$.",
          ],
          answer: "$f'(x) = 12(3x+1)^3$",
          selfExplain: "Why does the inside's derivative ($3$) have to multiply the whole thing?",
        },
      ],
      generator: "chainRule",
      mastery: { requiredStreak: 3, minLevel: 4 },
    },
  ],
};

export default unit;
