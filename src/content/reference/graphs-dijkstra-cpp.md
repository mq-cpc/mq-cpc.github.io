---
title: Dijkstra (C++)
category: graphs
lang: cpp
order: 5
blurb: The same algorithm for anyone on the C++ side of the team.
---
```cpp
void dijkstra(int s) {
  fill(dist, dist + N, INF); dist[s] = 0;
  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
  pq.push({0, s});
  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;
    for (auto [v, w] : adj[u])
      if (dist[u] + w < dist[v]) pq.push({dist[v] = dist[u] + w, v});
  }
}
```
