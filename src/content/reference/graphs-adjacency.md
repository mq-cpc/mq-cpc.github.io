---
title: Building an adjacency list
category: graphs
order: 1
blurb: The representation every traversal below assumes.
---
```java
int n = sc.nextInt(), m = sc.nextInt();

List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());

for (int i = 0; i < m; i++) {
    int u = sc.nextInt() - 1, v = sc.nextInt() - 1;   // if input is 1-indexed
    adj.get(u).add(v);
    adj.get(v).add(u);                                 // drop this line if directed
}
```

Weighted — store the weight alongside the destination:

```java
List<List<int[]>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());

adj.get(u).add(new int[]{v, w});
adj.get(v).add(new int[]{u, w});

for (int[] e : adj.get(u)) {
    int to = e[0], weight = e[1];
}
```

Read whether the input is 0- or 1-indexed before you write the loop; converting
once at read time is far less error-prone than remembering `- 1` everywhere
afterwards.
