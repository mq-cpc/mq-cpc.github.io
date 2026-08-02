---
name: Recursion & Backtracking
level: intermediate
order: 1
color: c3
blurb: Breaking problems into subproblems, then searching the solution space with backtracking.
videos:
  - title: Visualising Problems & Subproblems
    youtubeId: "snBcanv7m04"
    channel: Daniel Sutantyo
    duration: "18:57"
  - title: Group Sum
    youtubeId: "dmAJMyJyxoY"
    channel: Daniel Sutantyo
    duration: "24:43"
---
Recursion is how you turn a problem you can't see the answer to into a smaller
version of itself. The hard part is rarely the code — it's learning to see the
subproblem, which is where this topic starts.

From there it moves to backtracking: walking the space of possible answers and
abandoning a branch the moment it can't lead anywhere. These are the problems
where the first correct solution is often "try everything, carefully".

This is also the direct groundwork for
[Dynamic Programming](/topics/dynamic-programming) — you can't memoise a
recursion you haven't written yet.
