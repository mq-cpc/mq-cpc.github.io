---
title: PriorityQueue
category: collections
order: 5
blurb: Min-heap by default, max-heap and custom orders by comparator.
---
```java
PriorityQueue<Integer> min = new PriorityQueue<>();                    // smallest first
PriorityQueue<Integer> max = new PriorityQueue<>(Comparator.reverseOrder());

min.add(5); min.add(1); min.add(9);
min.peek();   // 1  — look without removing
min.poll();   // 1  — remove and return
min.size(); min.isEmpty();
```

Ordering an array or object by one field, then another:

```java
// {node, cost} ordered by cost, ties broken by node
PriorityQueue<int[]> pq = new PriorityQueue<>(
    Comparator.<int[]>comparingInt(e -> e[1]).thenComparingInt(e -> e[0]));
```

Two things that bite:

- **Iterating a `PriorityQueue` does not give sorted order.** Only `poll`
  does. `for (int x : pq)` walks the heap array.
- **There is no decrease-key.** The standard workaround is to push a second
  entry and skip stale ones when you pop — see the Dijkstra snippet.
