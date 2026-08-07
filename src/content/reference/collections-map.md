---
title: HashMap
category: collections
order: 2
blurb: Counting, grouping, and iterating without writing null checks.
---
```java
Map<String, Integer> count = new HashMap<>();

count.merge(word, 1, Integer::sum);           // count[word] += 1, starting at 1
count.put(k, count.getOrDefault(k, 0) + 1);   // the longhand of the same thing

count.containsKey(k);
count.remove(k);
count.size();

// Group values under a key without checking whether the list exists yet
Map<Integer, List<String>> byLength = new HashMap<>();
byLength.computeIfAbsent(w.length(), k -> new ArrayList<>()).add(w);

for (Map.Entry<String, Integer> e : count.entrySet()) {
    System.out.println(e.getKey() + " " + e.getValue());
}
for (String k : count.keySet()) { /* ... */ }
for (int v : count.values())    { /* ... */ }
```

`merge` and `computeIfAbsent` are the two that save the most typing. Reach for
them before writing `if (map.containsKey(k))`.

Iteration order is **not** insertion order and not sorted. Use `LinkedHashMap`
if you need insertion order, or `TreeMap` if you need keys in sorted order.
