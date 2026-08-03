---
title: Dijkstra — shortest path with weights
category: graphs
order: 4
blurb: Lazy deletion instead of decrease-key, and the overflow that costs teams a WA.
---
```java
long[] dist = new long[n];
Arrays.fill(dist, Long.MAX_VALUE);
dist[s] = 0;

// {node, distance so far}, ordered by distance
PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(e -> e[1]));
pq.add(new long[]{s, 0});

while (!pq.isEmpty()) {
    long[] cur = pq.poll();
    int u = (int) cur[0];
    if (cur[1] > dist[u]) continue;        // stale entry, already improved

    for (int[] e : adj.get(u)) {
        int v = e[0];
        long nd = dist[u] + e[1];
        if (nd < dist[v]) {
            dist[v] = nd;
            pq.add(new long[]{v, nd});
        }
    }
}
```

Java's `PriorityQueue` has no decrease-key, so push a new entry when a distance
improves and skip entries whose stored distance is worse than the current best.
That single `continue` is what keeps it `O((n + m) log n)`.

Two things that cost real submissions:

- **Use `long` for distances.** 100,000 edges of weight 10⁹ overflows `int`
  comfortably. Initialise to `Long.MAX_VALUE`, and check for it before printing
  rather than adding to it.
- **Dijkstra requires non-negative weights.** With a negative edge, use
  Bellman–Ford instead.
