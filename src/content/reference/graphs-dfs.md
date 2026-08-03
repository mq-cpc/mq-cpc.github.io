---
title: DFS — recursive and iterative
category: graphs
order: 3
blurb: Reachability and components, and why deep graphs need the iterative form.
---
```java
boolean[] seen = new boolean[n];

void dfs(int u) {
    seen[u] = true;
    for (int v : adj.get(u)) {
        if (!seen[v]) dfs(v);
    }
}
```

Counting connected components:

```java
int components = 0;
for (int i = 0; i < n; i++) {
    if (!seen[i]) { components++; dfs(i); }
}
```

**The recursive form overflows the stack on deep graphs.** Java's default
thread stack handles only a few thousand frames, and a path graph of 100,000
nodes is a legitimate test case. Either run the solve in a thread with a bigger
stack, or use the iterative form:

```java
Deque<Integer> st = new ArrayDeque<>();
st.push(s);
while (!st.isEmpty()) {
    int u = st.pop();
    if (seen[u]) continue;      // may be pushed more than once
    seen[u] = true;
    for (int v : adj.get(u)) {
        if (!seen[v]) st.push(v);
    }
}
```

```java
// A bigger stack, if you would rather keep the recursion
public static void main(String[] args) {
    new Thread(null, Main::solve, "main", 1 << 26).start();   // 64 MB
}
```
