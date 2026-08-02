---
name: Getting Started
level: foundations
order: 0
color: c5
blurb: New here? What competitive programming is, and how to begin.
videos:
  - title: Intro to Competitive Programming
    youtubeId: "2vi1o0Fr0Uk"
    channel: Daniel Sutantyo
    duration: "14:06"
---
Competitive programming is the sport of solving well-defined algorithmic
puzzles under time pressure. You're handed a problem — a precise description of
some input and exactly what output is expected — and you write a program that
produces the right answer, fast enough, for *every* case rather than just the
obvious ones. An online judge (we mostly use [Kattis](https://open.kattis.com/))
compiles your code, runs it against a battery of hidden test cases, and tells
you whether it passed.

The contest the club is built around is the **ICPC** — the International
Collegiate Programming Contest. It's a team event: three students share a
*single* computer and have five hours to solve as many problems as they can,
and it runs in stages, from regional qualifiers up to the annual World Finals.
We train for it, but you don't have to be chasing the World Finals to belong
here — the same practice makes you a sharper problem-solver and a stronger coder
whatever you're after.

The skills carry well beyond contests. You get sharp at turning a messy problem
into a clear model, choosing the right data structure, reasoning about how fast
your solution runs, and writing code that's correct the first time. It is also
genuinely fun — a puzzle you can feel yourself getting better at, week over week.

You don't need to be an expert to start. Pick a language (this club covers Java
and C++), make a Kattis account, and solve a couple of easy problems just to get
the submit-and-see loop under your fingers. The [roadmap](/learn) is the order we
suggest working through things; the videos walk you through each idea, and real
problems, step by step.

## Your first submission

The first time you submit something is the part nobody warns you about, so:

1. **Make an account** at [open.kattis.com](https://open.kattis.com/). It's free,
   and it's what remembers which problems you've solved.
2. **Start with an easy one.** Read the problem, then read the sample input and
   output — they tell you the exact format expected, which is half the battle.
3. **Test locally first** against the sample input. If your output doesn't match
   the sample byte for byte, it won't pass.
4. **Submit**, either through the website or the `kattis` command-line tool.

Then you wait a few seconds and get a verdict. These are the ones you'll actually see:

- **Accepted** — your program produced the right answer on every hidden test,
  fast enough. This is the one you're after.
- **Wrong Answer** — it ran fine, but the output was wrong on at least one test
  you can't see. Usually an edge case: an empty input, the largest value allowed,
  a tie, a single element.
- **Time Limit Exceeded** — correct, but too slow. Your approach works and needs
  to be smarter, not the code faster.
- **Run Time Error** — it crashed. Array out of bounds, dividing by zero, reading
  input that isn't there.
- **Compile Error** — it didn't build on the judge. Check you submitted the right
  file and that your class is named as the problem requires.

**Everyone's first submission fails.** Experienced competitors submit wrong
answers constantly — the loop *is* the practice, and a rejected submission costs
you nothing but the time to think again. If you're stuck for a long stretch,
step away and come back, or talk it through with someone; explaining a problem
out loud is usually enough to find the hole in it.
