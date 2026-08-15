---
topic: java-basics
title: "Free Food"
difficulty: easy
judge: Kattis
url: https://open.kattis.com/problems/freefood
section: arrays
order: 11
tags: ["arrays"]
hints:
  - >
    You are counting *days*, not events. Read the worked example again: the
    first two events both cover days 13 and 14, and the answer counts those
    days once.
  - >
    Check the limits before reaching for anything clever with intervals. A day
    is a number from 1 to 365, so the entire calendar fits in one small array.
  - >
    Keep a `boolean[366]`. For each event, mark every day from `s` to `t`.
    The answer is how many days ended up marked — no sorting, no merging.
---
