---
title: BFS — shortest path on an unweighted graph
category: graphs
order: 2
blurb: Distance in edges from one source, plus reconstructing the path.
---
```java
int[] dist = new int[n];
Arrays.fill(dist, -1);          // -1 doubles as "not visited"

Deque<Integer> q = new ArrayDeque<>();
dist[s] = 0;
q.addLast(s);

while (!q.isEmpty()) {
    int u = q.pollFirst();
    for (int v : adj.get(u)) {
        if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            q.addLast(v);
        }
    }
}
```

Mark a node as visited when you **enqueue** it, not when you dequeue it —
otherwise a node can enter the queue many times and the complexity degrades.

To recover the route, record where each node was reached from:

```java
int[] parent = new int[n];
Arrays.fill(parent, -1);
// inside the loop, next to dist[v] = dist[u] + 1:
parent[v] = u;

List<Integer> path = new ArrayList<>();
for (int cur = t; cur != -1; cur = parent[cur]) path.add(cur);
Collections.reverse(path);
```

BFS gives shortest paths only when every edge costs the same. If weights
differ, use Dijkstra. If weights are all 0 or 1, a deque works: push 0-weight
edges to the front and 1-weight edges to the back.
